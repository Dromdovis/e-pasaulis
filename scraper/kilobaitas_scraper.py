from typing import Optional, Dict, Any, cast
from playwright.sync_api import sync_playwright, Page, ElementHandle
from datetime import datetime
from pocketbase import PocketBase
import os
from dotenv import load_dotenv
import logging
import json
import time
import asyncio
from playwright.async_api import async_playwright

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class KilobaitasScraper:
    def __init__(self):
        load_dotenv()
        self.base_url: str = "https://www.kilobaitas.lt"
        self.laptops_url: str = f"{self.base_url}/kompiuteriai_ir_komponentai/nesiojami_kompiuteriai/nesiojami_kompiuteriai_notebook/kategorija.aspx?groupfilterid=56"
        self.pb_client: PocketBase = PocketBase(os.getenv('POCKETBASE_URL', 'http://127.0.0.1:8090'))
        self.page: Optional[Page] = None
        self.browser = None
        self.context = None
        
    async def init_browser(self) -> None:
        """Initialize the browser."""
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(
            headless=True
        )
        self.context = await self.browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080}
        )
        self.page = await self.context.new_page()
        
    async def close_browser(self) -> None:
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()

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
            logger.info("Starting to extract product data...")
            
            # Log the HTML content for debugging
            html_content = product_element.inner_html()
            logger.debug(f"Product HTML: {html_content}")
            
            # Extract name and URL
            logger.info("Looking for product name and URL...")
            name_elem = product_element.query_selector('.product-item h2.product-title a')
            if name_elem:
                logger.info("✓ Found product name element")
            else:
                logger.warning("✗ Could not find product name element")

            # Extract price
            logger.info("Looking for price...")
            price_elem = product_element.query_selector('.prices .price')
            if price_elem:
                logger.info("✓ Found price element")
            else:
                logger.warning("✗ Could not find price element")

            # Extract product code
            logger.info("Looking for product code...")
            code_elem = product_element.query_selector('.sku .value')
            if code_elem:
                logger.info("✓ Found product code element")
            else:
                logger.warning("✗ Could not find product code element")

            # Extract stock info
            logger.info("Looking for stock info...")
            stock_elem = product_element.query_selector('.stock .value')
            if stock_elem:
                logger.info("✓ Found stock info element")
            else:
                logger.warning("✗ Could not find stock info element")

            if not all([name_elem, price_elem]):
                logger.warning("❌ Missing essential elements (name/price) for product")
                return None
            
            # Extract data
            name = cast(ElementHandle, name_elem)
            price = cast(ElementHandle, price_elem)
            
            # Get name and URL
            name_text = name.text_content() or ''
            product_url = name.get_attribute('href') or ''
            if product_url and not product_url.startswith('http'):
                product_url = f"{self.base_url}{product_url}"
            logger.info(f"📝 Product: {name_text}")
            logger.info(f"🔗 URL: {product_url}")
            
            # Get price - handle currency formatting more robustly
            price_text = price.text_content() or '0'
            price_text_clean = price_text.split('€')[0].replace(',', '.').strip()
            try:
                price_value = float(price_text_clean)
                logger.info(f"💰 Price: {price_value}€")
            except ValueError:
                logger.warning(f"❌ Could not parse price: {price_text} -> {price_text_clean}")
                price_value = 0.0

            # Get product code
            code = ''
            if code_elem:
                code_text = code_elem.text_content() or ''
                code = code_text.strip()
                logger.info(f"📦 Product code: {code}")

            # Get stock info with default handling
            stock = 'Nėra sandėlyje'  # Default to "Not in stock"
            if stock_elem:
                stock_text = stock_elem.text_content()
                if stock_text:
                    stock = stock_text.strip()
                logger.info(f"📊 Stock: {stock}")

            # Get specifications
            specs = {}
            if product_url:
                logger.info("Getting detailed specifications...")
                specs = self.get_product_specifications(product_url)

            product_data = {
                'name': name_text.strip(),
                'price': price_value,
                'url': product_url,
                'code': code,
                'stock': stock,
                'specifications': specs,
                'category': 'laptops',
                'source': 'kilobaitas',
                'created': datetime.now().isoformat(),
                'updated': datetime.now().isoformat()
            }
            
            logger.info("✅ Successfully extracted all product data")
            logger.info("📦 Product data summary:")
            logger.info(f"   - Name: {product_data['name']}")
            logger.info(f"   - Price: {product_data['price']}€")
            logger.info(f"   - Code: {product_data['code']}")
            logger.info(f"   - Stock: {product_data['stock']}")
            logger.info(f"   - Specs: {len(product_data['specifications'])} items")
            
            return product_data
            
        except Exception as e:
            logger.error(f"❌ Error extracting product data: {e}")
            return None

    def get_product_specifications(self, product_url: str) -> Dict[str, str]:
        """Get detailed specifications from the product page."""
        try:
            logger.info(f"🔍 Opening product details page: {product_url}")
            page = self.context.new_page()
            logger.info("⌛ Waiting for page to load...")
            await page.goto(product_url, wait_until='networkidle', timeout=30000)
            logger.info("✓ Page loaded successfully")
            
            # Click on Specifikacija tab using more reliable selector
            logger.info("🔍 Looking for 'Specifikacija' tab...")
            spec_tab = page.query_selector('a[href="#specifikacija"]')
            if spec_tab:
                logger.info("🖱️ Clicking 'Specifikacija' tab...")
                spec_tab.click()
                logger.info("⌛ Waiting for specifications to load...")
                await page.wait_for_selector('div.resp-tab-content-active', timeout=10000)
                logger.info("✓ Specifications tab loaded")
                
                # Extract specifications - handle both table and list formats
                logger.info("📋 Extracting specifications...")
                specs = {}
                
                # Try tables first
                rows = page.query_selector_all('div.resp-tab-content-active tr')
                if not rows:
                    # Fallback to list items
                    rows = page.query_selector_all('.specification-list li')
                
                logger.info(f"Found {len(rows)} specification rows")
                
                for row in rows:
                    if isinstance(row, ElementHandle):
                        cells = row.query_selector_all('td')
                        if len(cells) == 2:
                            key_text = cells[0].text_content() or ''
                            value_text = cells[1].text_content() or ''
                            key = key_text.strip()
                            value = value_text.strip()
                            if key and value:  # Only add if both key and value are non-empty
                                specs[key] = value
                                logger.info(f"📝 Extracted spec: {key} = {value}")
                
                logger.info(f"✅ Successfully extracted {len(specs)} specifications")
                logger.info("🔒 Closing product details page")
                await page.close()
                return specs
            else:
                logger.warning("❌ Could not find 'Specifikacija' tab")
                logger.info("🔒 Closing product details page")
                await page.close()
                return {}
                
        except Exception as e:
            logger.error(f"❌ Error getting specifications: {e}")
            if 'page' in locals():
                logger.info("🔒 Closing product details page due to error")
                await page.close()
            return {}

    async def save_to_pocketbase(self, product_data: Dict[str, Any]) -> None:
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

    async def scrape_laptops(self):
        """Scrape laptop data from the website."""
        try:
            print("🚀 Starting laptop scraper...")
            
            # Initialize browser
            print("🌐 Initializing browser...")
            await self.init_browser()
            
            # Login to PocketBase
            print("🔑 Authenticating with PocketBase...")
            self.login_to_pocketbase()
            
            if not self.page:
                raise Exception("Browser page not initialized")
            
            # Navigate to the laptops page with reduced timeout
            print(f"🌐 Navigating to {self.laptops_url}")
            await self.page.goto(self.laptops_url, wait_until='networkidle', timeout=30000)
            print("✓ Initial page load complete")
            
            # Wait for the page content to be available
            print("⌛ Waiting for page content...")
            await self.page.wait_for_selector('body', timeout=5000)
            print("✓ Body element found")
            
            # Reduced delay for dynamic content
            print("⌛ Waiting for dynamic content...")
            await asyncio.sleep(2)
            print("✓ Wait complete")
            
            # Save screenshot of initial state
            await self.page.screenshot(path='debug_initial_state.png')
            print("📸 Saved initial state screenshot")

            # Try to find cookie consent button and click it
            try:
                cookie_button = await self.page.wait_for_selector('button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', timeout=5000)
                if cookie_button:
                    await cookie_button.click()
                    print("🍪 Clicked cookie consent button")
                    await asyncio.sleep(2)
                else:
                    print("ℹ️ No cookie consent button found (normal if already accepted)")
            except Exception as e:
                print("ℹ️ Cookie handling skipped:", str(e))

            # Save the page content for debugging
            content = await self.page.content()
            with open('debug_page_1.html', 'w', encoding='utf-8') as f:
                f.write(content)
            print("💾 Saved page content to debug_page_1.html")

            # Try different selectors for product listings
            selectors = [
                '.product-grid .item-box',
                '.product-list .item-box',
                '.item-grid .item-box',
                '.product-grid .product-item',
                '.item-box'
            ]

            products = None
            used_selector = None

            for selector in selectors:
                try:
                    print(f"🔍 Trying selector: {selector}")
                    products = await self.page.query_selector_all(selector)
                    if products and len(products) > 0:
                        print(f"✅ Found {len(products)} products with selector: {selector}")
                        used_selector = selector
                        break
                    else:
                        print(f"❌ No products found with selector: {selector}")
                except Exception as e:
                    print(f"⚠️ Error with selector {selector}:", str(e))

            if not products or len(products) == 0:
                print("⚠️ Warning: No products found with any selector")
                # Save screenshot of the error state
                await self.page.screenshot(path='debug_page_1.png')
                print("📸 Saved current page state")
                return

            print(f"✨ Found {len(products)} products to process")
            
            processed_count = 0
            page_num = 1
            
            while True:
                print(f"📄 Processing page {page_num}")
                await self.page.screenshot(path=f'debug_page_{page_num}.png')
                
                for product in products:
                    try:
                        data = await self.extract_product_data(product)
                        if data:
                            await self.save_to_pocketbase(data)
                            processed_count += 1
                    except Exception as e:
                        print(f"⚠️ Error processing product:", str(e))
                
                # Try to find and click next page button
                try:
                    next_button = await self.page.query_selector('.next-page')
                    if not next_button:
                        next_button = await self.page.query_selector('a[rel="next"]')
                    if not next_button:
                        next_button = await self.page.query_selector('.pagination-next')
                    
                    if next_button:
                        await next_button.click()
                        print(f"➡️ Clicked next page button")
                        await self.page.wait_for_selector(used_selector)
                        await asyncio.sleep(2)
                        products = await self.page.query_selector_all(used_selector)
                        page_num += 1
                    else:
                        print("✓ No more pages to process")
                        break
                except Exception as e:
                    print("✓ Pagination complete:", str(e))
                    break
            
            print(f"🎉 Successfully processed {processed_count} products across {page_num} pages")
            
        except Exception as e:
            print("❌ Error during scraping:", str(e))
            # Save screenshot of the error state
            await self.page.screenshot(path='debug_error_state.png')
            raise
        finally:
            print("👋 Scraper finished")
            await self.close_browser()

async def main() -> None:
    scraper = KilobaitasScraper()
    await scraper.scrape_laptops()

if __name__ == "__main__":
    asyncio.run(main()) 