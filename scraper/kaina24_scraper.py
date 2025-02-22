from typing import Optional, Dict, Any, cast
from playwright.sync_api import sync_playwright, Page, ElementHandle
from datetime import datetime
from pocketbase import PocketBase
import os
from dotenv import load_dotenv
import logging
import json
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class Kaina24Scraper:
    def __init__(self):
        load_dotenv()
        self.base_url: str = "https://www.kaina24.lt"
        self.computers_url: str = f"{self.base_url}/c/nesiojami-kompiuteriai/"  # Updated correct URL
        self.pb_client: PocketBase = PocketBase(os.getenv('POCKETBASE_URL', 'http://127.0.0.1:8090'))
        self.page: Optional[Page] = None
        
    def init_browser(self) -> None:
        self.playwright = sync_playwright().start()
        # Set headless=False to see the browser while scraping (useful for debugging)
        self.browser = self.playwright.chromium.launch(
            headless=False,
            args=['--start-maximized']
        )
        self.context = self.browser.new_context(
            viewport={'width': 1920, 'height': 1080}
        )
        self.page = self.context.new_page()
        
    def close_browser(self) -> None:
        if hasattr(self, 'context'):
            self.context.close()
        if hasattr(self, 'browser'):
            self.browser.close()
        if hasattr(self, 'playwright'):
            self.playwright.stop()

    def save_screenshot(self, name: str) -> None:
        """Save a screenshot for debugging purposes."""
        if self.page:
            self.page.screenshot(path=f"debug_{name}.png")
            logger.info(f"Saved screenshot: debug_{name}.png")
        
    def login_to_pocketbase(self) -> None:
        try:
            self.pb_client.admins.auth_with_password(
                os.getenv('POCKETBASE_EMAIL', ''),
                os.getenv('POCKETBASE_PASSWORD', '')
            )
            logger.info("Successfully authenticated with PocketBase")
        except Exception as e:
            logger.error(f"Failed to authenticate with PocketBase: {e}")
            raise

    def extract_product_data(self, product_element: ElementHandle) -> Optional[Dict[str, Any]]:
        try:
            # Log the HTML content for debugging
            html_content = product_element.inner_html()
            logger.debug(f"Product HTML: {html_content}")
            
            # Updated selectors based on actual page structure
            name_elem = product_element.query_selector('a.product-link')
            price_elem = product_element.query_selector('.price-new')
            img_elem = product_element.query_selector('.image img')
            shop_elem = product_element.query_selector('.store-logo')
            
            if not all([name_elem, price_elem]):
                logger.warning("Essential elements (name/price) not found in product")
                return None
            
            # Cast to ElementHandle to satisfy type checker
            name = cast(ElementHandle, name_elem)
            price = cast(ElementHandle, price_elem)
            
            name_text = name.text_content() or ''
            price_text = price.text_content() or '0'
            
            # Clean up price text and convert to float
            price_text_clean = ''.join(c for c in price_text if c.isdigit() or c in '.,')
            try:
                price_value = float(price_text_clean.replace(',', '.'))
            except ValueError:
                logger.warning(f"Could not parse price: {price_text} -> {price_text_clean}")
                price_value = 0.0
            
            # Optional elements
            image_url = ''
            if img_elem:
                img = cast(ElementHandle, img_elem)
                image_url = img.get_attribute('src') or img.get_attribute('data-src') or ''
            
            shop_name = ''
            if shop_elem:
                shop = cast(ElementHandle, shop_elem)
                shop_name = shop.get_attribute('title') or ''
            
            # Get the product URL
            product_url = name.get_attribute('href') or ''
            if product_url and not product_url.startswith('http'):
                product_url = f"{self.base_url}{product_url}"
            
            product_data = {
                'name': name_text.strip(),
                'price': price_value,
                'image': image_url,
                'url': product_url,
                'shop': shop_name.strip(),
                'category': 'laptops',
                'source': 'kaina24',
                'created': datetime.now().isoformat(),
                'updated': datetime.now().isoformat()
            }
            
            logger.info(f"Extracted product: {json.dumps(product_data, indent=2, ensure_ascii=False)}")
            return product_data
            
        except Exception as e:
            logger.error(f"Error extracting product data: {e}")
            return None

    def save_to_pocketbase(self, product_data: Dict[str, Any]) -> None:
        try:
            # Check if product already exists by name
            existing_products = self.pb_client.collection('products').get_list(
                query_params={'filter': f'name = "{product_data["name"]}"'}
            )
            
            if existing_products.items:
                # Update existing product
                self.pb_client.collection('products').update(
                    existing_products.items[0].id,
                    product_data
                )
                logger.info(f"Updated product: {product_data['name']}")
            else:
                # Create new product
                self.pb_client.collection('products').create(product_data)
                logger.info(f"Created new product: {product_data['name']}")
                
        except Exception as e:
            logger.error(f"Error saving product to PocketBase: {e}")

    def scrape_laptops(self) -> None:
        try:
            self.init_browser()
            self.login_to_pocketbase()
            
            if not self.page:
                raise RuntimeError("Browser page not initialized")
            
            logger.info(f"Navigating to {self.computers_url}")    
            self.page.goto(self.computers_url)
            
            # Wait for navigation and content to load
            self.page.wait_for_load_state('networkidle')
            time.sleep(2)  # Additional wait to ensure dynamic content loads
            
            # Accept cookies if the button exists
            try:
                cookie_button = self.page.get_by_role("button", name="SUTINKU")
                if cookie_button:
                    cookie_button.click()
                    logger.info("Accepted cookies")
            except Exception:
                logger.info("No cookie consent button found")
            
            # Save screenshot of initial page load
            self.save_screenshot("initial_load")
            
            # Wait for products to load - using the correct selector
            self.page.wait_for_selector('.product-grid', timeout=30000)
            
            # Save screenshot after products load
            self.save_screenshot("products_loaded")
            
            # Get all product elements on the page
            products = self.page.query_selector_all('.product-grid > div')
            logger.info(f"Found {len(products)} products")
            
            for i, product in enumerate(products, 1):
                logger.info(f"Processing product {i}/{len(products)}")
                product_data = self.extract_product_data(product)
                if product_data:
                    self.save_to_pocketbase(product_data)
                time.sleep(0.5)
                    
            logger.info("Completed scraping laptop data")
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            self.save_screenshot("error_state")
        finally:
            self.close_browser()

def main() -> None:
    scraper = Kaina24Scraper()
    scraper.scrape_laptops()

if __name__ == "__main__":
    main() 