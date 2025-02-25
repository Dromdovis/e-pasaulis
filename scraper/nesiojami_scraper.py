from typing import Optional, Dict, Any, List, cast
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
import argparse

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

class NesiojamiScraper:
    def __init__(self, category_type="laptops"):
        """
        Initialize the scraper.
        
        Args:
            category_type (str): Type of products to scrape. Options: 'laptops', 'consoles'
        """
        self.base_url: str = "https://nesiojami.lt"
        self.category_type = category_type
        
        # Set the appropriate URL based on category type
        if category_type == "laptops":
            self.category_url = f"{self.base_url}/produkto-kategorija/nesiojami-kompiuteriai/"
            self.category_name_lt = "Nešiojami kompiuteriai"
            self.category_name_en = "Laptops"
        elif category_type == "consoles":
            self.category_url = f"{self.base_url}/produkto-kategorija/zaidimu-konsoles/"
            self.category_name_lt = "Žaidimų konsolės"
            self.category_name_en = "Gaming Consoles"
        else:
            # Default to laptops if invalid category type
            logger.warning(f"Invalid category type: {category_type}. Defaulting to laptops.")
            self.category_url = f"{self.base_url}/produkto-kategorija/nesiojami-kompiuteriai/"
            self.category_name_lt = "Nešiojami kompiuteriai"
            self.category_name_en = "Laptops"
            self.category_type = "laptops"
            
        self.page: Optional[Page] = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.products_data: List[Dict[str, Any]] = []
        
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

    async def download_and_save_image(self, image_url: str, product_name: str) -> Optional[str]:
        """Download image and save it locally."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url, headers=headers) as response:
                    if response.status == 200:
                        # Verify content type
                        content_type = response.headers.get('content-type', '')
                        if not content_type.startswith('image/'):
                            logger.error(f"Invalid content type for {product_name} image: {content_type}")
                            return None
                            
                        # Determine file extension based on content type
                        ext = content_type.split('/')[-1].lower()
                        if ext == 'jpeg':
                            ext = 'jpg'
                        elif ext not in ['jpg', 'png', 'webp']:
                            ext = 'webp'  # Default to webp
                        
                        # Generate a safe filename
                        safe_name = self.generate_slug(product_name)
                        filename = f"{safe_name}.{ext}"
                        file_path = os.path.join(self.images_dir, filename)
                        
                        # Save the image to the local directory
                        image_data = await response.read()
                        with open(file_path, 'wb') as f:
                            f.write(image_data)
                            
                        logger.info(f"Successfully downloaded image for {product_name} to {file_path}")
                        return file_path
                    else:
                        logger.error(f"Failed to download image for {product_name}. Status: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error downloading image for {product_name}: {e}")
            return None

    async def upload_product_image(self, product_id: str, image_path: str) -> bool:
        """Upload product image to PocketBase."""
        try:
            if not os.path.exists(image_path):
                logger.error(f"Image file not found: {image_path}")
                return False

            filename = os.path.basename(image_path)
            file_ext = os.path.splitext(filename)[1].lower()[1:]  # Remove the dot
            mime_type = f"image/{file_ext}"

            # Create a tuple for each file field (filename, file object, content type)
            with open(image_path, 'rb') as f:
                file_data = f.read()
                
                # Create form data for both image fields
                form = {
                    'image': (filename, file_data, mime_type),
                    'images[]': [(filename, file_data, mime_type)]  # Note the [] for array fields
                }
                
                # Update the product with the image
                self.pb_client.collection('products').update(product_id, {}, form)
                logger.info(f"Successfully uploaded image for product {product_id}")
                return True
                
        except Exception as e:
            logger.error(f"Error uploading image for product {product_id}: {e}")
            return False

    async def stream_image_to_pocketbase(self, product_id: str, image_url: str, product_name: str) -> bool:
        """Stream an image directly from source URL to PocketBase without saving locally."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url, headers=headers) as response:
                    if response.status == 200:
                        # Verify content type
                        content_type = response.headers.get('content-type', '')
                        if not content_type.startswith('image/'):
                            logger.error(f"Invalid content type for {product_name} image: {content_type}")
                            return False
                            
                        # Determine file extension based on content type
                        ext = content_type.split('/')[-1].lower()
                        if ext == 'jpeg':
                            ext = 'jpg'
                        elif ext not in ['jpg', 'png', 'webp']:
                            ext = 'webp'  # Default to webp
                        
                        # Generate a safe filename
                        safe_name = self.generate_slug(product_name)
                        filename = f"{safe_name}.{ext}"
                        
                        # Read image data into memory
                        image_data = await response.read()
                        
                        # Prepare form data for PocketBase
                        mime_type = f"image/{ext}"
                        form = {
                            'image': (filename, image_data, mime_type),
                            'images[]': [(filename, image_data, mime_type)]
                        }
                        
                        # Update the product with the image
                        self.pb_client.collection('products').update(product_id, {}, form)
                        logger.info(f"Successfully streamed image for product {product_id}")
                        return True
                    else:
                        logger.error(f"Failed to stream image for {product_name}. Status: {response.status}")
                        return False
        except Exception as e:
            logger.error(f"Error streaming image for {product_name}: {e}")
            return False

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

            # Cast product_page to Page type to satisfy type checker
            page = cast(Page, product_page)
            
            # Set timeout for the page
            page.set_default_timeout(30000)  # 30 second timeout for product pages
            
            # Navigate with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    await page.goto(
                        product_url,
                        wait_until='domcontentloaded',  # Less strict wait condition
                        timeout=30000
                    )
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    logger.warning(f"Retry {attempt + 1}/{max_retries} loading {product_url}: {e}")
                    await asyncio.sleep(2)
            
            # Wait for the product gallery to load
            try:
                await page.wait_for_selector('.woocommerce-product-gallery__wrapper', timeout=10000)
            except Exception as e:
                logger.warning(f"Gallery selector not found: {e}")
                # Try to get at least the main image as a fallback
                main_img = await page.query_selector('img.wp-post-image')
                if main_img:
                    img_url = await main_img.get_attribute('src')
                    if img_url:
                        # Clean up the URL if needed
                        img_url = re.sub(r'-\d+x\d+\.', '.', img_url)
                        # Ensure absolute URL
                        if not img_url.startswith(('http://', 'https://')):
                            img_url = f"{self.base_url.rstrip('/')}/{img_url.lstrip('/')}"
                        image_urls.append(img_url)
                return image_urls
            
            # First try the main gallery images
            gallery_items = await page.query_selector_all('.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image')
            if gallery_items:
                for item in gallery_items:
                    # Try to get the full-size image URL
                    img_elem = await item.query_selector('img')
                    if img_elem:
                        # Try different attributes for the full-size image
                        img_url = await img_elem.get_attribute('data-large_image')
                        if not img_url:
                            img_url = await img_elem.get_attribute('data-src')
                        if not img_url:
                            img_url = await img_elem.get_attribute('src')
                        
                        if img_url:
                            # Clean up the URL if needed
                            img_url = re.sub(r'-\d+x\d+\.', '.', img_url)
                            # Ensure absolute URL
                            if not img_url.startswith(('http://', 'https://')):
                                img_url = f"{self.base_url.rstrip('/')}/{img_url.lstrip('/')}"
                            # Add to our list if not already present
                            if img_url not in image_urls:
                                image_urls.append(img_url)
            else:
                # Alternative approach for sites with different gallery structure
                img_elems = await page.query_selector_all('.woocommerce-product-gallery img')
                for img_elem in img_elems:
                    img_url = await img_elem.get_attribute('data-large_image') or await img_elem.get_attribute('data-src') or await img_elem.get_attribute('src')
                    if img_url:
                        # Clean up the URL
                        img_url = re.sub(r'-\d+x\d+\.', '.', img_url)
                        if not img_url.startswith(('http://', 'https://')):
                            img_url = f"{self.base_url.rstrip('/')}/{img_url.lstrip('/')}"
                        if img_url not in image_urls:
                            image_urls.append(img_url)
            
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
                    # Don't propagate page closing errors

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
        """Extract basic product data from the product card."""
        try:
            # Get product link and image
            product_link_elem = await product_element.query_selector('a.woocommerce-LoopProduct-link')
            if not product_link_elem:
                logger.warning("Could not find product link element")
                return None

            # Get product URL
            product_url = await product_link_elem.get_attribute('href')
            if not product_url:
                logger.warning("Could not find product URL")
                return None
            
            # Get product name
            name_elem = await product_element.query_selector('h2.woocommerce-loop-product__title')
            name = await name_elem.text_content() if name_elem else None
            if not name:
                return None
                
            # Generate slug
            slug = self.generate_slug(name)
            
            # Get product price with better error handling
            try:
                price_elem = await product_element.query_selector('span.woocommerce-Price-amount bdi')
                price_text = await price_elem.text_content() if price_elem else "0"
                # Clean up price text and convert to float - add null check
                if price_text:
                    price = float(price_text.replace('€', '').replace(',', '.').strip())
                else:
                    price = 0.0
            except (ValueError, AttributeError) as e:
                logger.warning(f"Error parsing price: {e}")
                price = 0.0

            # Get detailed specifications
            specs = await self.get_product_specifications(product_url)
            
            # Get all product images - this is a new step to get multiple images
            image_urls = await self.get_product_images(product_url)

            # Get category ID
            category_id = await self.get_category_id()

            product_data = {
                'name': name.strip(),
                'slug': slug,
                'price': price,
                'url': product_url,
                'image_urls': image_urls,  # Now we store all image URLs
                'specifications': specs,
                'source': 'nesiojami',
                'category': category_id,  # Category relation
                'created': datetime.now().isoformat(),
                'updated': datetime.now().isoformat()
            }

            logger.info(f"Extracted product: {product_data['name']} with {len(image_urls)} images")
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
            # Open new page for product details and ensure it's properly typed
            product_page = await self.context.new_page()
            if not product_page:
                logger.error("Failed to create new page")
                return specs

            # Cast product_page to Page type to satisfy type checker
            page = cast(Page, product_page)
                
            # Set timeout for the page
            page.set_default_timeout(30000)  # 30 second timeout for product pages
            
            # Navigate with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    await page.goto(
                        product_url,
                        wait_until='domcontentloaded',  # Less strict wait condition
                        timeout=30000
                    )
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    logger.warning(f"Retry {attempt + 1}/{max_retries} loading {product_url}: {e}")
                    await asyncio.sleep(2)
            
            # Wait for specifications tab content
            spec_div = await page.wait_for_selector(
                'div.woocommerce-Tabs-panel--additional_information',
                timeout=10000
            )
            
            if not spec_div:
                logger.warning(f"No specifications found for {product_url}")
                return specs

            # Get all attribute divs
            attributes = await page.query_selector_all('div.shop_attributes div.attribute')
            
            for attr in attributes:
                try:
                    # Get label and value
                    label_elem = await attr.query_selector('div.label')
                    value_elem = await attr.query_selector('div.value')
                    
                    if label_elem and value_elem:
                        label = await label_elem.text_content()
                        value = await value_elem.text_content()
                        
                        if label and value:
                            specs[label.strip()] = value.strip()
                except Exception as e:
                    logger.error(f"Error extracting specification: {e}")
                    continue

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
                    # Don't raise an exception if we can't close the page

    async def save_to_pocketbase(self, product_data: Dict[str, Any]) -> None:
        """Save a product to PocketBase."""
        try:
            # Check if product already exists by URL
            existing_products = self.pb_client.collection('products').get_list(
                query_params={
                    'filter': f'url = "{product_data["url"]}" && source = "nesiojami"'
                }
            )

            # Create description from specifications
            specs = product_data['specifications']
            description_parts = []
            
            # Add key specs to description if available
            key_specs = ['Procesorius', 'Operatyvioji atmintis', 'Kietasis diskas', 'Ekranas', 'Operacinė sistema']
            for spec in key_specs:
                if spec in specs:
                    description_parts.append(f"{spec}: {specs[spec]}")

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
                'description': '\n'.join(description_parts) if description_parts else "No description available",
                'stock': 0,
                'productType': 'physical',
                'updated': datetime.now().isoformat()
            }

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
                filename = f'nesiojami_{self.category_type}_products.json'
                
            # Ensure we're saving to the correct directory
            file_path = os.path.join(os.getcwd(), filename)
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(self.products_data, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved {len(self.products_data)} {self.category_type} products to {file_path} (backup)")
        except Exception as e:
            logger.error(f"Error saving to JSON backup: {e}")

    async def scrape_products(self) -> None:
        """Main scraping function for all product types."""
        try:
            logger.info(f"Starting {self.category_type} scraper...")
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
                        wait_until='domcontentloaded',  # Less strict wait condition
                        timeout=60000  # Increased timeout
                    )
                    logger.info(f"Successfully loaded the {self.category_type} page")
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        logger.error(f"Failed to load page after {max_retries} attempts")
                        raise
                    logger.warning(f"Retry {attempt + 1}/{max_retries} loading main page: {e}")
                    await asyncio.sleep(2)

            logger.info(f"Navigated to {self.category_type} page")

            # Add a small delay to let dynamic content load
            await asyncio.sleep(5)

            page_num = 1
            while True:
                try:
                    logger.info(f"Processing page {page_num}")
                    
                    # Wait for product grid with retry
                    products_loaded = False
                    for _ in range(3):
                        try:
                            await self.page.wait_for_selector('ul.products', timeout=10000)
                            products_loaded = True
                            break
                        except Exception:
                            await asyncio.sleep(2)
                    
                    if not products_loaded:
                        logger.error("Could not load products grid")
                        break
                    
                    # Get all products on current page
                    products = await self.page.query_selector_all('li.product')
                    if not products:
                        logger.info("No more products found")
                        break

                    logger.info(f"Found {len(products)} products on page {page_num}")

                    # Process each product
                    for product in products:
                        try:
                            product_data = await self.extract_product_data(product)
                            if product_data:
                                # Save to both memory and PocketBase
                                self.products_data.append(product_data)
                                await self.save_to_pocketbase(product_data)
                        except Exception as e:
                            logger.error(f"Error processing product: {e}")
                            continue

                    # Check for next page
                    next_button = await self.page.query_selector('a.next')
                    if next_button:
                        await next_button.click()
                        await asyncio.sleep(2)  # Wait for page transition
                        await self.page.wait_for_load_state('domcontentloaded')
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
                # Don't let cleanup errors affect the overall process

async def main() -> None:
    # Parse command-line arguments for category type
    parser = argparse.ArgumentParser(description='Scrape products from nesiojami.lt')
    parser.add_argument(
        '--category', 
        type=str, 
        default='laptops', 
        choices=['laptops', 'consoles'],
        help='Category to scrape: laptops or consoles'
    )
    args = parser.parse_args()
    
    # Initialize scraper with specified category
    scraper = NesiojamiScraper(category_type=args.category)
    await scraper.scrape_products()

if __name__ == "__main__":
    asyncio.run(main()) 