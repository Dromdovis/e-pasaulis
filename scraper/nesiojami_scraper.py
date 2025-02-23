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
import tempfile
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NesiojamiScraper:
    def __init__(self):
        self.base_url: str = "https://nesiojami.lt"
        self.laptops_url: str = f"{self.base_url}/produkto-kategorija/nesiojami-kompiuteriai/"
        self.page: Optional[Page] = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.products_data: List[Dict[str, Any]] = []
        
        # Initialize PocketBase
        load_dotenv()
        self.pb_client = PocketBase(os.getenv('NEXT_PUBLIC_POCKETBASE_URL', 'http://127.0.0.1:8090'))
        self.authenticate_pocketbase()
        
        # Cache for category ID
        self._laptop_category_id = None

    def authenticate_pocketbase(self) -> None:
        """Authenticate with PocketBase."""
        try:
            # Debug logging
            logger.info(f"PocketBase URL: {os.getenv('NEXT_PUBLIC_POCKETBASE_URL')}")
            logger.info(f"PocketBase Email: {os.getenv('POCKETBASE_ADMIN_EMAIL')}")
            logger.info(f"PocketBase Password length: {len(os.getenv('POCKETBASE_ADMIN_PASSWORD', ''))}")
            
            self.pb_client.admins.auth_with_password(
                os.getenv('POCKETBASE_ADMIN_EMAIL', ''),
                os.getenv('POCKETBASE_ADMIN_PASSWORD', '')
            )
            logger.info("Successfully authenticated with PocketBase")
        except Exception as e:
            logger.error(f"Failed to authenticate with PocketBase: {e}")
            raise

    async def init_browser(self) -> None:
        """Initialize the browser."""
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(
            headless=True,
            args=['--disable-dev-shm-usage']  # Helps with memory issues
        )
        
        if not self.browser:
            raise RuntimeError("Failed to initialize browser")
            
        self.context = await self.browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080}
        )
        
        if not self.context:
            raise RuntimeError("Failed to create browser context")
        
        # Add more realistic browser behavior
        await self.context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
        
        self.page = await self.context.new_page()
        
        if not self.page:
            raise RuntimeError("Failed to create new page")
        
        # Set default timeout to 60 seconds
        self.page.set_default_timeout(60000)

    async def close_browser(self) -> None:
        """Close browser and all pages."""
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()

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

    async def get_laptop_category_id(self) -> str:
        """Get or create the laptop category and return its ID."""
        if self._laptop_category_id:
            return self._laptop_category_id

        try:
            # Try to find existing laptop category with proper filter syntax
            result = self.pb_client.collection('categories').get_list(
                query_params={
                    'filter': 'name_lt = "Nešiojami kompiuteriai"',
                    'page': 1,
                    'perPage': 1
                }
            )

            if result.items:
                self._laptop_category_id = result.items[0].id
                logger.info(f"Found existing laptop category with ID: {self._laptop_category_id}")
            else:
                # Create new laptop category with required fields
                category_data = {
                    'name_lt': 'Nešiojami kompiuteriai',
                    'slug': 'nesiojami-kompiuteriai',
                    'description_lt': 'Plataus asortimento nešiojami kompiuteriai',
                    'name_en': 'Laptops',
                    'description_en': 'Wide range of laptops for every need',
                    'created': datetime.now().isoformat(),
                    'updated': datetime.now().isoformat()
                }
                try:
                    result = self.pb_client.collection('categories').create(category_data)
                    self._laptop_category_id = result.id
                    logger.info(f"Created new laptop category with ID: {self._laptop_category_id}")
                except Exception as create_error:
                    logger.error(f"Failed to create category: {str(create_error)}")
                    raise

            return self._laptop_category_id

        except Exception as e:
            logger.error(f"Error getting/creating laptop category: {str(e)}")
            raise

    async def download_and_save_image(self, image_url: str, product_name: str) -> Optional[str]:
        """Download image and save it as a temporary file."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url) as response:
                    if response.status == 200:
                        # Always save as WebP since that's what the source provides
                        with tempfile.NamedTemporaryFile(delete=False, suffix='.webp') as tmp_file:
                            image_data = await response.read()
                            tmp_file.write(image_data)
                            logger.info(f"Successfully downloaded image for {product_name}")
                            return tmp_file.name
                    else:
                        logger.error(f"Failed to download image for {product_name}. Status: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error downloading image for {product_name}: {e}")
            return None

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
            
            # Get product image
            img_elem = await product_link_elem.query_selector('img.attachment-woocommerce_thumbnail')
            img_url = await img_elem.get_attribute('src') if img_elem else None
            
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

            # Get category ID
            category_id = await self.get_laptop_category_id()

            # Download image if available
            image_path = None
            if img_url:
                image_path = await self.download_and_save_image(img_url, name)

            product_data = {
                'name': name.strip(),
                'slug': slug,
                'price': price,
                'url': product_url,
                'image_url': img_url,  # Original image URL
                'specifications': specs,
                'source': 'nesiojami',
                'category': category_id,  # Category relation
                'created': datetime.now().isoformat(),
                'updated': datetime.now().isoformat(),
                'image_path': image_path  # Temporary path to downloaded image
            }

            logger.info(f"Extracted product: {product_data['name']}")
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
                await product_page.close()

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
                'price': str(product_data['price']),  # Convert price to string
                'url': product_data['url'],
                'image_url': product_data['image_url'],
                'specifications': json.dumps(product_data['specifications']),  # Convert dict to JSON string
                'source': product_data['source'],
                'category': product_data['category'],
                'description': '\n'.join(description_parts) if description_parts else "No description available",
                'stock': 0,  # Default to 0 since we can't determine actual stock
                'updated': datetime.now().isoformat()
            }

            # If this is a new record, add created timestamp
            if not existing_products.items:
                form_data['created'] = product_data['created']

            logger.info(f"Preparing to save product: {form_data['name']}")

            # Handle image upload
            if product_data.get('image_url'):
                try:
                    # Download image
                    async with aiohttp.ClientSession() as session:
                        async with session.get(product_data['image_url']) as response:
                            if response.status == 200:
                                image_data = await response.read()
                                # Create a temporary file
                                with tempfile.NamedTemporaryFile(delete=False, suffix='.webp') as tmp_file:
                                    tmp_file.write(image_data)
                                    tmp_file_path = tmp_file.name

                                # Create the multipart form data
                                with open(tmp_file_path, 'rb') as image_file:
                                    # Save to PocketBase
                                    if existing_products.items:
                                        # Update existing product
                                        product_id = existing_products.items[0].id
                                        logger.info(f"Updating existing product with ID: {product_id}")
                                        self.pb_client.collection('products').update(
                                            product_id,
                                            form_data,
                                            {
                                                "image": (os.path.basename(product_data['image_url']), image_file),
                                                "images": [(os.path.basename(product_data['image_url']), image_file)]
                                            }
                                        )
                                    else:
                                        # Create new product
                                        logger.info("Creating new product")
                                        self.pb_client.collection('products').create(
                                            form_data,
                                            {
                                                "image": (os.path.basename(product_data['image_url']), image_file),
                                                "images": [(os.path.basename(product_data['image_url']), image_file)]
                                            }
                                        )

                                # Clean up temporary file
                                try:
                                    os.unlink(tmp_file_path)
                                except Exception as e:
                                    logger.warning(f"Error cleaning up temporary image file: {e}")
                            else:
                                logger.error(f"Failed to download image. Status: {response.status}")
                                self._save_without_image(form_data, existing_products)
                except Exception as img_error:
                    logger.error(f"Error processing image: {img_error}")
                    self._save_without_image(form_data, existing_products)
            else:
                self._save_without_image(form_data, existing_products)

            logger.info(f"Successfully saved product in PocketBase: {product_data['name']}")

        except Exception as e:
            logger.error(f"Error saving to PocketBase: {str(e)}")
            # Log the actual data that caused the error
            logger.error(f"Problematic product data: {json.dumps(product_data, default=str, indent=2)}")
            # Save to JSON as backup
            await self.save_to_json()

    def _save_without_image(self, form_data: Dict[str, Any], existing_products: Any) -> None:
        """Save product without image."""
        if existing_products.items:
            product_id = existing_products.items[0].id
            self.pb_client.collection('products').update(product_id, form_data)
        else:
            self.pb_client.collection('products').create(form_data)

    async def save_to_json(self, filename: str = 'nesiojami_products.json') -> None:
        """Save scraped products to JSON file as backup."""
        try:
            # Ensure we're saving to the correct directory
            file_path = os.path.join(os.getcwd(), filename)
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(self.products_data, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved {len(self.products_data)} products to {file_path} (backup)")
        except Exception as e:
            logger.error(f"Error saving to JSON backup: {e}")

    async def scrape_laptops(self) -> None:
        """Main scraping function."""
        try:
            logger.info("Starting laptop scraper...")
            await self.init_browser()
            
            if not self.page:
                raise Exception("Browser page not initialized")

            # Navigate to laptops page with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    await self.page.goto(
                        self.laptops_url,
                        wait_until='domcontentloaded',  # Less strict wait condition
                        timeout=60000  # Increased timeout
                    )
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    logger.warning(f"Retry {attempt + 1}/{max_retries} loading main page: {e}")
                    await asyncio.sleep(2)

            logger.info("Navigated to laptops page")

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
            await self.close_browser()

async def main() -> None:
    scraper = NesiojamiScraper()
    await scraper.scrape_laptops()

if __name__ == "__main__":
    asyncio.run(main()) 