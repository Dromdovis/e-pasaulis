import os
import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin
import hashlib
from PIL import Image
from io import BytesIO

class ProductScraper:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.image_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'product_images')
        os.makedirs(self.image_dir, exist_ok=True)

    def download_and_optimize_image(self, image_url, product_id):
        try:
            response = requests.get(image_url)
            if response.status_code == 200:
                # Create unique filename based on URL
                filename = f"{product_id}_{hashlib.md5(image_url.encode()).hexdigest()[:10]}.jpg"
                filepath = os.path.join(self.image_dir, filename)

                # Optimize image
                img = Image.open(BytesIO(response.content))
                img = img.convert('RGB')  # Convert to RGB format
                
                # Resize if too large
                max_size = (1920, 1080)
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Save with optimization
                img.save(filepath, 'JPEG', quality=85, optimize=True)
                return filename
            return None
        except Exception as e:
            print(f"Error downloading image {image_url}: {e}")
            return None

    def scrape_product(self, url):
        try:
            response = self.session.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract product details
            product = {
                'name': soup.select_one('h1.product-title').text.strip(),
                'price': float(soup.select_one('span.price').text.strip().replace('€', '')),
                'description': soup.select_one('div.product-description').text.strip(),
                'images': []
            }

            # Download images
            image_elements = soup.select('div.product-gallery img')
            for img in image_elements:
                image_url = urljoin(self.base_url, img['src'])
                if image_filename := self.download_and_optimize_image(image_url, product['id']):
                    product['images'].append(image_filename)

            return product
        except Exception as e:
            print(f"Error scraping product {url}: {e}")
            return None

    def upload_to_pocketbase(self, product, pb_client):
        try:
            # Create product record
            product_data = {
                'name': product['name'],
                'price': product['price'],
                'description': product['description'],
                'categoryId': '...',  # Set appropriate category
            }
            
            record = pb_client.collection('products').create(product_data)

            # Upload images
            for image_filename in product['images']:
                image_path = os.path.join(self.image_dir, image_filename)
                with open(image_path, 'rb') as image_file:
                    pb_client.collection('products').update(record.id, {
                        'image': image_file,
                    })

            return record
        except Exception as e:
            print(f"Error uploading product to PocketBase: {e}")
            return None 