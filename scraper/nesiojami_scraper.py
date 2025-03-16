from typing import Optional, Dict, Any, List
from playwright.async_api import async_playwright, Page, ElementHandle, Browser, BrowserContext
from datetime import datetime
import logging
import json
import asyncio
import os
from pocketbase import PocketBase
from dotenv import load_dotenv
import re
import aiohttp
from aiohttp import ClientTimeout
import tempfile
from pathlib import Path
import io
from urllib.parse import urljoin

# Try to import requests, provide helpful error if not installed
try:
    import requests  # Add requests module import for file uploads
except ImportError:
    print("ERROR: The 'requests' module is required but not installed.")
    print("Please install it using: pip install requests")
    import sys
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SkytechScraper:
    def __init__(self):
        """Initialize the scraper for desktop computers from skytech.lt"""
        self.base_url = "https://www.skytech.lt"
        self.category_url = f"{self.base_url}/staliniai-kompiuteriai-firminiai-kompiuteriai-branded-c-86_32_564.html"
        
        # Set category names
        self.category_name_lt = "Staliniai kompiuteriai"
        self.category_name_en = "Desktop Computers"
        self.category_type = "desktops"
        
        # Number of products per page (for pagination)
        self.products_per_page = 100
            
        self.page = None
        self.browser = None
        self.context = None
        self.products_data = []
        
        # Use a temporary directory for images
        self.temp_dir = tempfile.TemporaryDirectory()
        self.images_dir = Path(self.temp_dir.name)
        logger.info(f"Temporary images directory created at: {self.images_dir}")
        
        # Initialize PocketBase
        load_dotenv()
        logger.info("Environment variables loaded")
        logger.info(f"PocketBase URL: {os.getenv('NEXT_PUBLIC_POCKETBASE_URL')}")
        
        self.pb_client = PocketBase(os.getenv('NEXT_PUBLIC_POCKETBASE_URL', 'http://127.0.0.1:8090'))
        logger.info("PocketBase client initialized")
        
        self.authenticate_pocketbase()
        logger.info("PocketBase authentication completed")
        
        # Cache for category ID
        self._category_id = None

    def __del__(self):
        """Clean up temporary directory when the scraper object is destroyed."""
        if hasattr(self, 'temp_dir'):
            self.temp_dir.cleanup()
            logger.info("Temporary images directory cleaned up")

    def authenticate_pocketbase(self) -> None:
        """Authenticate with PocketBase."""
        try:
            email = os.getenv('POCKETBASE_ADMIN_EMAIL')
            password = os.getenv('POCKETBASE_ADMIN_PASSWORD')
            
            if not email or not password:
                raise ValueError("PocketBase admin credentials not found in environment variables")
            
            logger.info(f"Attempting to authenticate with email: {email}")
            
            self.pb_client.admins.auth_with_password(email, password)
            logger.info("Successfully authenticated with PocketBase")
        except Exception as e:
            logger.error(f"Failed to authenticate with PocketBase: {str(e)}")
            raise

    async def init_browser(self) -> None:
        """Initialize the browser."""
        try:
            logger.info("Starting Playwright initialization")
            playwright = await async_playwright().start()
            logger.info("Playwright started")
            
            self.browser = await playwright.chromium.launch(
                headless=True,
                args=['--disable-dev-shm-usage']  # Helps with memory issues
            )
            logger.info("Browser launched")
            
            if not self.browser:
                raise RuntimeError("Failed to initialize browser")
                
            self.context = await self.browser.new_context(
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                viewport={'width': 1920, 'height': 1080}
            )
            logger.info("Browser context created")
            
            if not self.context:
                raise RuntimeError("Failed to create browser context")
            
            # Add more realistic browser behavior
            await self.context.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
            """)
            logger.info("Browser anti-detection script added")
            
            self.page = await self.context.new_page()
            logger.info("New page created")
            
            if not self.page:
                raise RuntimeError("Failed to create new page")
            
            # Set default timeout to 60 seconds
            self.page.set_default_timeout(60000)
            logger.info("Browser initialization completed successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize browser: {str(e)}")
            raise

    async def close_browser(self) -> None:
        """Close browser and all pages."""
        try:
            if self.context:
                try:
                    await self.context.close()
                    logger.info("Browser context closed successfully")
                except Exception as e:
                    logger.warning(f"Error closing browser context: {e}")
                    # Context might already be closed, which is fine
            
            if self.browser:
                try:
                    await self.browser.close()
                    logger.info("Browser closed successfully")
                except Exception as e:
                    logger.warning(f"Error closing browser: {e}")
                    # Browser might already be closed, which is fine
        except Exception as e:
            logger.warning(f"Error during browser cleanup: {e}")
            # Don't raise the exception as it's just cleanup

    async def safe_wait_for_selector(self, selector: str, timeout: int = 10000) -> Optional[ElementHandle]:
        """Safely wait for and return an element."""
        if not self.page:
            logger.error("Page not initialized")
            return None
            
        try:
            return await self.page.wait_for_selector(selector, timeout=timeout)
        except Exception as e:
            logger.warning(f"Timeout waiting for selector {selector}: {e}")
            return None

    def generate_slug(self, name: str) -> str:
        """Generate a URL-friendly slug from the product name."""
        # Convert to lowercase and replace spaces with hyphens
        slug = name.lower()
        # Remove special characters
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        # Replace spaces with hyphens
        slug = re.sub(r'\s+', '-', slug)
        # Remove multiple consecutive hyphens
        slug = re.sub(r'-+', '-', slug)
        # Trim hyphens from ends
        return slug.strip('-')

    async def get_category_id(self) -> str:
        """Get or create the product category and return its ID."""
        if self._category_id:
            return self._category_id

        try:
            # Try to find existing category with proper filter syntax
            result = self.pb_client.collection('categories').get_list(
                query_params={
                    'filter': f'name_lt = "{self.category_name_lt}"',
                    'page': 1,
                    'perPage': 1
                }
            )

            if result.items:
                self._category_id = result.items[0].id
                logger.info(f"Found existing category with ID: {self._category_id}")
            else:
                # Create new category with required fields
                category_data = {
                    'name_lt': self.category_name_lt,
                    'slug': self.generate_slug(self.category_name_lt),
                    'description_lt': f'Plataus asortimento {self.category_name_lt}',
                    'name_en': self.category_name_en,
                    'description_en': f'Wide range of {self.category_name_en} for every need',
                    'created': datetime.now().isoformat(),
                    'updated': datetime.now().isoformat()
                }
                try:
                    result = self.pb_client.collection('categories').create(category_data)
                    self._category_id = result.id
                    logger.info(f"Created new category with ID: {self._category_id}")
                except Exception as create_error:
                    logger.error(f"Failed to create category: {str(create_error)}")
                    raise

            return self._category_id

        except Exception as e:
            logger.error(f"Error getting/creating category: {str(e)}")
            raise

    async def stream_all_images_to_pocketbase(self, product_id: str, image_urls: List[str], product_name: str) -> bool:
        """Stream multiple images to PocketBase, setting the first as the thumbnail and uploading each additional image separately."""
        if not image_urls:
            logger.warning(f"No images to upload for product: {product_name}")
            return False
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            }
            
            # Track successful uploads
            successful_uploads = 0
            thumbnail_uploaded = False

            # Build a list of all file paths to upload at the end
            thumbnail_file = None
            gallery_files = []
            
            # Process each image individually
            async with aiohttp.ClientSession() as session:
                for i, img_url in enumerate(image_urls):
                    try:
                        logger.info(f"Processing image {i+1}/{len(image_urls)} for {product_name}")
                        
                        # Download the image - using proper ClientTimeout object
                        async with session.get(img_url, headers=headers, timeout=ClientTimeout(total=30)) as response:
                            if response.status != 200:
                                logger.warning(f"Failed to download image {i+1}/{len(image_urls)} for {product_name}. Status: {response.status}")
                                continue
                                
                            # Verify content type
                            content_type = response.headers.get('content-type', '')
                            if not content_type.startswith('image/'):
                                logger.warning(f"Invalid content type for {product_name} image {i+1}: {content_type}")
                                continue
                                
                            # Determine file extension based on content type
                            ext = content_type.split('/')[-1].lower()
                            if ext == 'jpeg':
                                ext = 'jpg'
                            elif ext not in ['jpg', 'png', 'webp']:
                                ext = 'webp'  # Default to webp
                            
                            # Generate a safe filename with index
                            safe_name = self.generate_slug(product_name)
                            filename = f"{safe_name}-{i+1}.{ext}"
                            
                            # Read image data into memory
                            image_data = await response.read()
                            
                            # Save image to temporary file
                            temp_file_path = os.path.join(self.images_dir, filename)
                            with open(temp_file_path, 'wb') as f:
                                f.write(image_data)
                            
                            # Store file paths for later upload
                            if i == 0:
                                thumbnail_file = temp_file_path
                            else:
                                gallery_files.append(temp_file_path)
                                
                    except aiohttp.ClientError as e:
                        logger.error(f"Connection error downloading image {i+1} for {product_name}: {e}")
                        continue
                    except Exception as e:
                        logger.error(f"Unexpected error processing image {i+1} for {product_name}: {e}")
                        continue
            
            # Now upload the thumbnail first
            if thumbnail_file:
                try:
                    # Use requests directly for more reliable multipart upload
                    pb_url = os.getenv('NEXT_PUBLIC_POCKETBASE_URL', 'http://127.0.0.1:8090')
                    endpoint = f"{pb_url}/api/collections/products/records/{product_id}"
                    
                    # Get the auth token from PocketBase client
                    auth_token = self.pb_client.auth_store.token
                    
                    # Get file extension for MIME type
                    file_ext = os.path.splitext(thumbnail_file)[1][1:].lower()
                    if not file_ext or file_ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                        file_ext = 'jpeg'  # Default to jpeg if extension is missing or invalid
                    
                    mime_type = f'image/{file_ext}'
                    # Convert jpg to jpeg for MIME type (standard)
                    if file_ext == 'jpg':
                        mime_type = 'image/jpeg'
                    
                    # Upload thumbnail
                    with open(thumbnail_file, 'rb') as file:
                        files = {'image': (os.path.basename(thumbnail_file), file, mime_type)}
                        headers = {'Authorization': f"Bearer {auth_token}"}
                        
                        response = requests.patch(endpoint, files=files, headers=headers)
                        
                        if response.status_code == 200:
                            logger.info(f"Successfully uploaded thumbnail image for product {product_id}")
                            thumbnail_uploaded = True
                            successful_uploads += 1
                            
                            # Verify the image field is actually set in the response
                            response_data = response.json()
                            if not response_data.get('image'):
                                logger.warning(f"Thumbnail upload succeeded but image field is empty in response for {product_id}")
                            else:
                                logger.info(f"Verified thumbnail image was saved with URL: {response_data.get('image')}")
                        else:
                            logger.error(f"Failed to upload thumbnail image. Status: {response.status_code}, Response: {response.text}")
                except Exception as e:
                    logger.error(f"Error uploading thumbnail for {product_name}: {e}")
                finally:
                    # Clean up thumbnail file
                    try:
                        if os.path.exists(thumbnail_file):
                            os.remove(thumbnail_file)
                    except Exception as e:
                        logger.warning(f"Could not remove temporary file {thumbnail_file}: {e}")
            
            # Then upload each gallery image
            for idx, gallery_file in enumerate(gallery_files):
                try:
                    # Use requests for reliable multipart upload
                    pb_url = os.getenv('NEXT_PUBLIC_POCKETBASE_URL', 'http://127.0.0.1:8090')
                    endpoint = f"{pb_url}/api/collections/products/records/{product_id}"
                    
                    # Get the auth token
                    auth_token = self.pb_client.auth_store.token
                    
                    # Get file extension for MIME type
                    file_ext = os.path.splitext(gallery_file)[1][1:].lower()
                    if not file_ext or file_ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                        file_ext = 'jpeg'  # Default to jpeg if extension is missing or invalid
                    
                    mime_type = f'image/{file_ext}'
                    # Convert jpg to jpeg for MIME type (standard)
                    if file_ext == 'jpg':
                        mime_type = 'image/jpeg'
                    
                    # Upload gallery image
                    with open(gallery_file, 'rb') as file:
                        # IMPORTANT: For PocketBase's field 'images' which is array type,
                        # the field name for form data should be 'images' not 'images[]'
                        files = {'images': (os.path.basename(gallery_file), file, mime_type)}
                        headers = {'Authorization': f"Bearer {auth_token}"}
                        
                        response = requests.patch(endpoint, files=files, headers=headers)
                        
                        if response.status_code == 200:
                            logger.info(f"Successfully uploaded gallery image {idx+1} for product {product_id}")
                            successful_uploads += 1
                            
                            # Verify the images field is populated
                            response_data = response.json()
                            if not response_data.get('images') or len(response_data.get('images', [])) == 0:
                                logger.warning(f"Gallery image upload succeeded but images field is empty in response for {product_id}")
                            else:
                                # Log images array size
                                images_count = len(response_data.get('images', []))
                                logger.info(f"Verified gallery images were saved. Product now has {images_count} images in gallery.")
                        else:
                            logger.error(f"Failed to upload gallery image {idx+1}. Status: {response.status_code}, Response: {response.text}")
                except Exception as e:
                    logger.error(f"Error uploading gallery image {idx+1} for {product_name}: {e}")
                finally:
                    # Clean up gallery file
                    try:
                        if os.path.exists(gallery_file):
                            os.remove(gallery_file)
                    except Exception as e:
                        logger.warning(f"Could not remove temporary file {gallery_file}: {e}")
                
                # Add a small delay between uploads
                await asyncio.sleep(0.5)
            
            # Report results
            if thumbnail_uploaded:
                logger.info(f"Successfully uploaded {successful_uploads} images for product {product_id} ({successful_uploads}/{len(image_urls)} succeeded)")
                return True
            else:
                logger.warning(f"Failed to upload thumbnail image for {product_name}")
                return False
                
        except Exception as e:
            logger.error(f"Error in image upload process for {product_name}: {e}")
            return False

    async def extract_product_data(self, product_element: ElementHandle) -> Optional[Dict[str, Any]]:
        """Extract product data from a product row."""
        try:
            # Get product link (which contains the name and URL)
            name_cell = await product_element.query_selector('td.name a')
            if not name_cell:
                logger.warning("Could not find product name element")
                return None
                
            # Get product URL
            product_url = await name_cell.get_attribute('href')
            if not product_url:
                logger.warning("Could not find product URL")
                return None
                
            # Make the URL absolute
            product_url = urljoin(self.base_url, product_url)
            
            # Get product name
            name_text = await name_cell.text_content()
            if not name_text:
                logger.warning("Could not find product name text")
                return None
                
            # Split the name into model and product name
            model = ""
            name = name_text.strip()
            
            # Try to extract model from the name
            if "MODELIS:" in name:
                parts = name.split("MODELIS:", 1)
                if len(parts) > 1:
                    model = parts[1].strip().split(" ", 1)[0].strip()
                    if len(parts[1].split(" ", 1)) > 1:
                        name = parts[1].split(" ", 1)[1].strip()
            
            # Get product image
            img_element = await product_element.query_selector('td.image img')
            image_url = ""
            if img_element:
                image_src = await img_element.get_attribute('src')
                if image_src:
                    image_url = urljoin(self.base_url, image_src)
            
            # Get product price
            price_element = await product_element.query_selector('td strong')
            price_text = await price_element.text_content() if price_element else "0"
            
            try:
                # Parse price, removing the currency symbol and converting to float
                price = float(price_text.replace('€', '').replace(' ', '').replace(',', '.').strip())
            except (ValueError, AttributeError):
                logger.warning(f"Error parsing price: {price_text}")
                price = 0.0
                
            # Get stock information
            stock_element = await product_element.query_selector('td.kiekis')
            stock_text = await stock_element.text_content() if stock_element else "0"
            
            # Parse stock information
            stock = 0
            if stock_text:
                if '5+' in stock_text:
                    stock = 5  # Set to 5 for "5+" stock
                elif stock_element:
                    class_attr = await stock_element.get_attribute('class')
                    if class_attr and 'date' in class_attr:
                        # This is a date, not a stock number
                        stock = 0
                    else:
                        # Try to extract a number
                        try:
                            stock_match = re.search(r'\d+', stock_text)
                            if stock_match:
                                stock = int(stock_match.group(0))
                        except (ValueError, AttributeError):
                            logger.warning(f"Error parsing stock: {stock_text}")
                            stock = 0
                else:
                    # Try to extract a number
                    try:
                        stock_match = re.search(r'\d+', stock_text)
                        if stock_match:
                            stock = int(stock_match.group(0))
                    except (ValueError, AttributeError):
                        logger.warning(f"Error parsing stock: {stock_text}")
                        stock = 0
            
            # Get detailed specifications from the product page
            specs = await self.get_product_specifications(product_url)
            
            # Try to extract model from specifications if not found in name
            if not model and 'Modelis' in specs:
                model = specs['Modelis']
            
            # Get full-size product images from the product page
            image_urls = await self.get_product_images(product_url)
            
            # If no image URLs were found from the detail page, use the thumbnail
            if not image_urls and image_url:
                image_urls = [image_url]
                
            # Generate slug
            slug = self.generate_slug(name)
            
            # Get category ID
            category_id = await self.get_category_id()
            
            # Create the product data dictionary
            product_data = {
                'name': name.strip(),
                'model': model.strip(),
                'slug': slug,
                'price': price,
                'url': product_url,
                'image_urls': image_urls, 
                'specifications': specs,
                'stock': stock,
                'source': 'skytech',
                'category': category_id,
                'created': datetime.now().isoformat(),
                'updated': datetime.now().isoformat()
            }

            logger.info(f"Extracted product: {product_data['name']} with {len(image_urls)} images, Price: {price}€, Stock: {stock}, Specs: {len(specs)}")
            return product_data

        except Exception as e:
            logger.error(f"Error extracting product data: {e}")
            return None

    async def get_product_specifications(self, product_url: str) -> Dict[str, str]:
        """Get detailed specifications from the product page."""
        specs = {}
        product_page = None
        
        if not self.context:
            logger.error("Browser context not initialized")
            return specs
            
        try:
            # Open new page for product details
            product_page = await self.context.new_page()
            if not product_page:
                logger.error("Failed to create new page")
                return specs

            # Set timeout for the page
            product_page.set_default_timeout(30000)  # 30 second timeout for product pages
            
            # Navigate with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    await product_page.goto(
                        product_url,
                        wait_until='domcontentloaded',
                        timeout=30000
                    )
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    logger.warning(f"Retry {attempt + 1}/{max_retries} loading {product_url}: {e}")
                    await asyncio.sleep(2)
            
            # Try different approaches to extract specifications
            
            # 1. Look for product info in the main product information section
            product_info = await product_page.query_selector('div.productInfoMain')
            if product_info:
                # Extract product name and model
                model_elem = await product_info.query_selector('div.model')
                if model_elem:
                    model_text = await model_elem.text_content()
                    if model_text:
                        model_parts = model_text.split(':')
                        if len(model_parts) > 1:
                            specs['Modelis'] = model_parts[1].strip()
                
                # Extract price and currency
                price_elem = await product_info.query_selector('span.productPrice')
                if price_elem:
                    price_text = await price_elem.text_content()
                    if price_text:
                        specs['Kaina'] = price_text.strip()
                
                # Extract manufacturer
                brand_elem = await product_info.query_selector('div.brand a')
                if brand_elem:
                    brand_text = await brand_elem.text_content()
                    if brand_text:
                        specs['Gamintojas'] = brand_text.strip()
            
            # 2. Look for specifications in standard tables with class 'produktas'
            spec_tables = await product_page.query_selector_all('table.produktas')
            for table in spec_tables:
                rows = await table.query_selector_all('tr')
                for row in rows:
                    try:
                        # Get columns in the row
                        cells = await row.query_selector_all('td')
                        if len(cells) >= 2:
                            key_cell = cells[0]
                            value_cell = cells[1]
                            
                            key = await key_cell.text_content()
                            value = await value_cell.text_content()
                            
                            if key and value:
                                key = key.strip().rstrip(':')
                                value = value.strip()
                                specs[key] = value
                    except Exception as e:
                        logger.error(f"Error extracting specification row: {e}")
                        continue
            
            # 3. Look for specifications in the description tab
            # First check if we need to click the description tab to load content
            description_tab = await product_page.query_selector('#tab_description')
            if description_tab:
                try:
                    # Check if tab is not active and needs to be clicked
                    tab_class = await description_tab.get_attribute('class')
                    if tab_class and 'selected' not in tab_class:
                        await description_tab.click()
                        await asyncio.sleep(1)  # Wait for tab content to load
                except Exception as e:
                    logger.warning(f"Error activating description tab: {e}")
            
            # Now look for specifications in the description content
            detailed_specs = await product_page.query_selector('#tab-description, div.tab-container, div.description-text')
            if detailed_specs:
                # Look for structured specs as key-value pairs
                spec_divs = await detailed_specs.query_selector_all('div.description-text, p, li')
                
                for div in spec_divs:
                    try:
                        # Check for content with strong tags (key-value format)
                        strong_element = await div.query_selector('strong, b')
                        if strong_element:
                            key = await strong_element.text_content()
                            # Get the text after the strong element
                            div_text = await div.text_content()
                            if key and div_text:
                                value = div_text.replace(key, '').strip().strip(':').strip('-').strip()
                                
                                if value:
                                    key = key.strip().rstrip(':').rstrip('-').strip()
                                    specs[key] = value
                        else:
                            # Try to split text by ':' or '-' for simple key-value pairs
                            text = await div.text_content()
                            if text and ':' in text:
                                parts = text.split(':', 1)
                                if len(parts) == 2 and parts[0].strip() and parts[1].strip():
                                    key = parts[0].strip()
                                    value = parts[1].strip()
                                    specs[key] = value
                    except Exception as e:
                        logger.error(f"Error extracting detailed specification: {e}")
                        continue
                
                # If we couldn't extract structured data, at least save the full description
                if not specs and detailed_specs:
                    full_text = await detailed_specs.text_content()
                    if full_text:
                        specs['Aprašymas'] = full_text.strip()
            
            # 4. Extract technical parameters table if available
            tech_table = await product_page.query_selector('table.technical-parameters')
            if tech_table:
                rows = await tech_table.query_selector_all('tr')
                for row in rows:
                    try:
                        cells = await row.query_selector_all('td')
                        if len(cells) >= 2:
                            key_cell = cells[0]
                            value_cell = cells[1]
                            
                            key = await key_cell.text_content()
                            value = await value_cell.text_content()
                            
                            if key and value:
                                key = key.strip().rstrip(':')
                                value = value.strip()
                                specs[key] = value
                    except Exception as e:
                        logger.error(f"Error extracting technical parameter: {e}")
                        continue
            
            # 5. Extract product features if available
            features = await product_page.query_selector('div.productFeatures')
            if features:
                feature_items = await features.query_selector_all('li')
                if feature_items and len(feature_items) > 0:
                    feature_texts = []
                    for item in feature_items:
                        feature_text = await item.text_content()
                        if feature_text:
                            feature_texts.append(feature_text.strip())
                    
                    if feature_texts:
                        specs['Ypatybės'] = ', '.join(feature_texts)
            
            # 6. If we still don't have enough specs, try to parse from page title and meta description
            if len(specs) < 3:
                title = await product_page.title()
                if title:
                    specs['Pilnas pavadinimas'] = title.strip()
                
                meta_desc = await product_page.query_selector('meta[name="description"]')
                if meta_desc:
                    content = await meta_desc.get_attribute('content')
                    if content:
                        specs['Meta aprašymas'] = content.strip()
            
            logger.info(f"Extracted {len(specs)} specifications")
            return specs

        except Exception as e:
            logger.error(f"Error getting specifications: {e}")
            return specs
        finally:
            if product_page:
                try:
                    await product_page.close()
                except Exception as e:
                    logger.warning(f"Error closing product page: {e}")

    async def get_product_images(self, product_url: str) -> List[str]:
        """Get all product images from the product detail page."""
        image_urls = []
        product_page = None
        
        if not self.context:
            logger.error("Browser context not initialized")
            return image_urls
        
        try:
            # Open new page for product details
            product_page = await self.context.new_page()
            if not product_page:
                logger.error("Failed to create new page")
                return image_urls
            
            # Navigate with retry logic
            await product_page.goto(product_url, wait_until='domcontentloaded')
            
            # Wait for the main product image to load
            await asyncio.sleep(2)  # Wait for images to load
            
            # Try to get high-resolution images
            
            # Method 1: Get the main image from zoom link (highest quality)
            main_zoom_link = await product_page.query_selector('a#zoom1')
            if main_zoom_link:
                href = await main_zoom_link.get_attribute('href')
                if href:
                    # This is usually the highest quality image
                    full_img_url = urljoin(self.base_url, href)
                    image_urls.append(full_img_url)
                    logger.info(f"Found high-res main image: {full_img_url}")
            
            # Method 2: If zoom link didn't work, try the regular image but transform to large version
            if not image_urls:
                main_image = await product_page.query_selector('a#zoom1 img')
                if main_image:
                    src = await main_image.get_attribute('src')
                    if src is not None:
                        # Convert to large image URL by changing path patterns
                        # Try multiple transformations to get the highest quality
                        large_src = src
                        # Replace /thumb/ with /large/
                        large_src = large_src.replace('/thumb/', '/large/')
                        # Replace /xsmall/ with /large/
                        large_src = large_src.replace('/xsmall/', '/large/')
                        # Replace /medium/ with /large/
                        large_src = large_src.replace('/medium/', '/large/')
                        # Some sites use popup for the large version
                        large_src = large_src.replace('_thumb.', '_popup.')
                        
                        # Also try to use the original image by removing size indicators
                        original_src = re.sub(r'_(thumb|small|medium|popup)\.', '.', src)
                        
                        # Add both versions - the system will try the first one first
                        image_url = urljoin(self.base_url, large_src)
                        image_urls.append(image_url)
                        
                        # Add original version if it's different
                        if original_src != src:
                            original_url = urljoin(self.base_url, original_src)
                            if original_url not in image_urls:
                                image_urls.append(original_url)
            
            # Method 3: Try to find additional images in the gallery
            gallery_links = await product_page.query_selector_all('div.additionalImages a, div.imageGallery a')
            for link in gallery_links:
                href = await link.get_attribute('href')
                if href:
                    # This is usually a high-quality image
                    full_img_url = urljoin(self.base_url, href)
                    if full_img_url not in image_urls:
                        image_urls.append(full_img_url)
            
            # Method 4: Look for hidden high-res images in the page
            hidden_imgs = await product_page.query_selector_all('div[style*="display:none"] a[href*="images/"], div.hidden a[href*="images/"]')
            for img_link in hidden_imgs:
                href = await img_link.get_attribute('href')
                if href and href not in image_urls:
                    full_img_url = urljoin(self.base_url, href)
                    image_urls.append(full_img_url)
            
            # Method 5: Check for JSON data that might contain image URLs
            try:
                json_script = await product_page.query_selector('script[type="application/ld+json"]')
                if json_script:
                    json_content = await json_script.text_content()
                    if json_content:
                        json_data = json.loads(json_content)
                        if 'image' in json_data:
                            image_data = json_data['image']
                            if isinstance(image_data, list):
                                for img_url in image_data:
                                    if img_url and img_url not in image_urls:
                                        image_urls.append(img_url)
                            elif isinstance(image_data, str) and image_data not in image_urls:
                                image_urls.append(image_data)
            except Exception as e:
                logger.warning(f"Error extracting images from JSON: {e}")
            
            logger.info(f"Found {len(image_urls)} product images")
            return image_urls

        except Exception as e:
            logger.error(f"Error getting product images: {e}")
            return image_urls
        finally:
            if product_page:
                try:
                    await product_page.close()
                except Exception as e:
                    logger.warning(f"Error closing product page: {e}")

    async def save_to_pocketbase(self, product_data: Dict[str, Any]) -> None:
        """Save a product to PocketBase."""
        try:
            # Check if product already exists by URL
            existing_products = self.pb_client.collection('products').get_list(
                query_params={
                    'filter': f'url = "{product_data["url"]}" && source = "skytech"'
                }
            )

            # Create description from specifications
            specs = product_data['specifications']
            description_parts = []
            
            # Define priority key specs to include in description
            priority_specs = [
                'Procesorius', 'Processor', 'CPU', 
                'Operatyvioji atmintis', 'RAM', 'Memory',
                'Kietasis diskas', 'Storage', 'SSD', 'HDD',
                'Ekranas', 'Display', 'Screen',
                'Vaizdo plokštė', 'Graphics', 'GPU',
                'Operacinė sistema', 'OS', 'Operating System',
                'Modelis', 'Model', 'Part Number'
            ]
            
            # First add priority specs to description
            for spec in priority_specs:
                if spec in specs:
                    description_parts.append(f"{spec}: {specs[spec]}")
            
            # Then add any available description fields
            description_fields = ['Aprašymas', 'Meta aprašymas', 'Pilnas pavadinimas']
            for field in description_fields:
                if field in specs and specs[field] and len(description_parts) < 5:
                    description_parts.append(f"{specs[field]}")
            
            # If we still don't have enough description, add other specs
            if len(description_parts) < 5:
                for key, value in specs.items():
                    if key not in priority_specs and key not in description_fields:
                        description_parts.append(f"{key}: {value}")
                        if len(description_parts) >= 5:
                            break
            
            # Limit description length
            description = '\n'.join(description_parts)
            if len(description) > 2000:
                description = description[:1997] + "..."
            
            # If description is still empty, use product name
            if not description:
                description = f"{product_data['name']} - Skytech.lt" 

            # Prepare the base form data
            form_data = {
                'name': product_data['name'],
                'slug': product_data['slug'],
                'price': str(product_data['price']),
                'url': product_data['url'],
                'image_url': product_data['image_urls'][0] if product_data.get('image_urls') else "",  # First image URL for reference
                'specifications': json.dumps(product_data['specifications']),
                'source': product_data['source'],
                'category': product_data['category'],
                'description': description,
                'stock': product_data['stock'],
                'productType': 'physical',
                'updated': datetime.now().isoformat()
            }
            
            # Add model if available
            if product_data.get('model') and product_data['model'].strip():
                form_data['model'] = product_data['model']

            # If this is a new record, add created timestamp
            if not existing_products.items:
                form_data['created'] = product_data['created']

            logger.info(f"Preparing to save product: {form_data['name']}")

            # First save/update the product without the images
            try:
                if existing_products.items:
                    # Update existing product
                    product_id = existing_products.items[0].id
                    logger.info(f"Updating existing product with ID: {product_id}")
                    self.pb_client.collection('products').update(product_id, form_data)
                else:
                    # Create new product
                    logger.info("Creating new product")
                    result = self.pb_client.collection('products').create(form_data)
                    product_id = result.id

                # Now upload all product images at once - the first will be the thumbnail, all go to gallery
                if product_data.get('image_urls'):
                    await self.stream_all_images_to_pocketbase(product_id, product_data['image_urls'], product_data['name'])

                logger.info(f"Successfully saved product in PocketBase: {product_data['name']}")

            except Exception as e:
                logger.error(f"Error saving to PocketBase: {str(e)}")
                # Log the actual data that caused the error
                logger.error(f"Problematic product data: {json.dumps(product_data, default=str, indent=2)}")
                # Save to JSON as backup
                await self.save_to_json()

        except Exception as e:
            logger.error(f"Error in save_to_pocketbase: {str(e)}")
            await self.save_to_json()

    async def save_to_json(self, filename: Optional[str] = None) -> None:
        """Save scraped products to JSON file as backup."""
        try:
            # Generate filename if not provided
            if filename is None:
                filename = f'skytech_desktop_products.json'
                
            # Ensure we're saving to the correct directory
            file_path = os.path.join(os.getcwd(), filename)
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(self.products_data, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved {len(self.products_data)} desktop products to {file_path} (backup)")
        except Exception as e:
            logger.error(f"Error saving to JSON backup: {e}")

    async def _get_total_pages(self) -> int:
        """Get the total number of pages from the pagination."""
        try:
            # Find the pagination links
            pagination_links = []
            if self.page:
                pagination_links = await self.page.query_selector_all('tr td:has(a[href*="page="]) a')
            
            if not pagination_links or len(pagination_links) == 0:
                return 1  # Only one page
                
            # Get the last pagination link that has a page number
            max_page = 1
            for link in pagination_links:
                href = await link.get_attribute('href')
                if href:
                    match = re.search(r'page=(\d+)', href)
                    if match:
                        page_num = int(match.group(1))
                        max_page = max(max_page, page_num)
            
            return max_page
        except Exception as e:
            logger.error(f"Error getting total pages: {e}")
            return 1  # Default to 1 page if there's an error

    async def scrape_products(self) -> None:
        """Main scraping function for desktop computers from skytech.lt."""
        try:
            logger.info("Starting desktop computer scraper for skytech.lt...")
            await self.init_browser()
            
            if not self.page:
                raise Exception("Browser page not initialized")

            logger.info(f"Navigating to URL: {self.category_url}")
            # Navigate to category page with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    await self.page.goto(
                        self.category_url,
                        wait_until='domcontentloaded',
                        timeout=60000  # Increased timeout
                    )
                    logger.info("Successfully loaded the desktop computers page")
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        logger.error(f"Failed to load page after {max_retries} attempts")
                        raise
                    logger.warning(f"Retry {attempt + 1}/{max_retries} loading main page: {e}")
                    await asyncio.sleep(2)

            # Get total number of pages
            total_pages = await self._get_total_pages()
            logger.info(f"Found {total_pages} pages to process")

            page_num = 1
            while page_num <= total_pages:
                try:
                    logger.info(f"Processing page {page_num} of {total_pages}")
                    
                    # Wait for product table to load
                    await self.page.wait_for_selector('table.productListing tr.productListing', timeout=10000)
                    
                    # Get all product rows (skip the header row)
                    product_rows = await self.page.query_selector_all('table.productListing tr.productListing')
                    
                    if not product_rows:
                        logger.info("No products found on this page")
                        break

                    logger.info(f"Found {len(product_rows)} products on page {page_num}")

                    # Process each product row
                    for product_row in product_rows:
                        try:
                            product_data = await self.extract_product_data(product_row)
                            if product_data:
                                # Save to both memory and PocketBase
                                self.products_data.append(product_data)
                                await self.save_to_pocketbase(product_data)
                        except Exception as e:
                            logger.error(f"Error processing product: {e}")
                            continue

                    # Move to the next page if there are more pages
                    if page_num < total_pages:
                        # Construct the URL for the next page
                        next_page_url = f"{self.category_url.split('?')[0]}?grp=0&sort=5d&pagesize={self.products_per_page}&page={page_num + 1}"
                        
                        logger.info(f"Navigating to next page: {next_page_url}")
                        await self.page.goto(next_page_url, wait_until='domcontentloaded')
                        await asyncio.sleep(2)  # Wait for page to load
                        
                        page_num += 1
                    else:
                        logger.info("No more pages to process")
                        break
                        
                except Exception as e:
                    logger.error(f"Error processing page {page_num}: {e}")
                    # Save what we have so far as backup
                    await self.save_to_json()
                    break

            # Final backup save
            await self.save_to_json()
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            # Try to save what we have even if there was an error
            await self.save_to_json()
            raise
        finally:
            try:
                await self.close_browser()
            except Exception as e:
                logger.warning(f"Error during browser cleanup: {e}")

async def main() -> None:
    """Main function to start the scraping process."""
    scraper = SkytechScraper()
    await scraper.scrape_products()

if __name__ == "__main__":
    asyncio.run(main()) 