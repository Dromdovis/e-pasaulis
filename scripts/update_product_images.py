import os
import asyncio
from pocketbase import PocketBase
from dotenv import load_dotenv
import logging
import re
import tempfile
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ProductImageUpdater:
    def __init__(self):
        # Initialize PocketBase
        load_dotenv()
        logger.info("Environment variables loaded")
        logger.info(f"PocketBase URL: {os.getenv('NEXT_PUBLIC_POCKETBASE_URL')}")
        
        self.pb_client = PocketBase(os.getenv('NEXT_PUBLIC_POCKETBASE_URL', 'http://127.0.0.1:8090'))
        logger.info("PocketBase client initialized")
        
        self.authenticate_pocketbase()
        logger.info("PocketBase authentication completed")
        
        # Use Python's tempfile module for temporary storage
        self.temp_dir = tempfile.TemporaryDirectory()
        self.images_dir = Path(self.temp_dir.name)
        logger.info(f"Images directory: {self.images_dir}")

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

    async def update_product_images(self):
        """Update all products with their corresponding images."""
        try:
            # Get all products from nesiojami source
            products_result = self.pb_client.collection('products').get_list(
                query_params={
                    'filter': 'source = "nesiojami"',
                    'page': 1,
                    'perPage': 100
                }
            )

            logger.info(f"Found {len(products_result.items)} products to update")

            # Create a dictionary of products with slugified names as keys for faster lookup
            products_dict = {}
            for product in products_result.items:
                # Access product data as a dictionary
                product_data = vars(product)
                product_name = product_data.get('name', '')
                
                # If name is not directly accessible, try to get it from the raw data
                if not product_name and hasattr(product, 'collection_id'):
                    product_name = product.collection_id
                
                # If still no name, try to access it as an attribute
                if not product_name:
                    product_name = getattr(product, 'name', '')
                
                if product_name:
                    slug = self.generate_slug(product_name)
                    products_dict[slug] = product

            # Get all image files from the product_images directory
            image_files = [f for f in os.listdir(self.images_dir) if f.endswith('.webp')]
            logger.info(f"Found {len(image_files)} image files in the product_images directory")

            # Process each image file
            for image_file in image_files:
                # Extract the slug from the image filename (remove .webp extension)
                image_slug = image_file.rsplit('.', 1)[0]
                image_path = os.path.join(self.images_dir, image_file)
                
                # Find matching product
                if image_slug in products_dict:
                    matching_product = products_dict[image_slug]
                    try:
                        # Read the image file
                        with open(image_path, 'rb') as f:
                            file_data = f.read()

                        # Create form data for both image fields
                        form = {
                            'image': (image_file, file_data, 'image/webp'),
                            'images[]': [(image_file, file_data, 'image/webp')]
                        }

                        # Update the product with the image
                        self.pb_client.collection('products').update(matching_product.id, {}, form)
                        logger.info(f"Successfully updated image for product: {image_slug}")
                    except Exception as e:
                        logger.error(f"Error updating image for product {image_slug}: {e}")
                else:
                    # Try a more flexible matching approach
                    found_match = False
                    for slug, product in products_dict.items():
                        if slug in image_slug or image_slug in slug:
                            try:
                                # Read the image file
                                with open(image_path, 'rb') as f:
                                    file_data = f.read()

                                # Create form data for both image fields
                                form = {
                                    'image': (image_file, file_data, 'image/webp'),
                                    'images[]': [(image_file, file_data, 'image/webp')]
                                }

                                # Update the product with the image
                                self.pb_client.collection('products').update(product.id, {}, form)
                                logger.info(f"Successfully updated image for product with partial match: {image_slug} -> {slug}")
                                found_match = True
                                break
                            except Exception as e:
                                logger.error(f"Error updating image for product with partial match {image_slug} -> {slug}: {e}")
                    
                    if not found_match:
                        logger.warning(f"No matching product found for image: {image_file}")

            logger.info("Image update process completed")

        except Exception as e:
            logger.error(f"Error updating product images: {e}")

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

    def __del__(self):
        # Clean up temp directory when scraper is destroyed
        if hasattr(self, 'temp_dir'):
            self.temp_dir.cleanup()

async def main():
    updater = ProductImageUpdater()
    await updater.update_product_images()

if __name__ == "__main__":
    asyncio.run(main()) 