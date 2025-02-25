import os
import sys
import logging
import tempfile
import requests
import json
from dotenv import load_dotenv
from pocketbase import PocketBase

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_create_product_with_image():
    """Test creating a new product with an image attachment"""
    # Load environment variables
    load_dotenv()
    logger.info("Environment variables loaded")
    pb_url = os.getenv('NEXT_PUBLIC_POCKETBASE_URL', 'http://127.0.0.1:8090')
    logger.info(f"PocketBase URL: {pb_url}")
    
    # Initialize PocketBase
    pb_client = PocketBase(pb_url)
    logger.info("PocketBase client initialized")
    
    # Authenticate with PocketBase
    try:
        email = os.getenv('POCKETBASE_ADMIN_EMAIL')
        password = os.getenv('POCKETBASE_ADMIN_PASSWORD')
        
        if not email or not password:
            raise ValueError("PocketBase admin credentials not found in environment variables")
        
        logger.info(f"Attempting to authenticate with email: {email}")
        pb_client.admins.auth_with_password(email, password)
        logger.info("Successfully authenticated with PocketBase")
    except Exception as e:
        logger.error(f"Failed to authenticate with PocketBase: {str(e)}")
        return
    
    # Create a temporary directory to store test images
    with tempfile.TemporaryDirectory() as temp_dir:
        # Download a test image
        test_image_url = "https://via.placeholder.com/300.jpg"
        logger.info(f"Downloading test image from: {test_image_url}")
        
        response = requests.get(test_image_url)
        if response.status_code != 200:
            logger.error(f"Failed to download test image. Status code: {response.status_code}")
            return
        
        # Save the image to a temporary file
        temp_file_path = os.path.join(temp_dir, "test_image.jpg")
        with open(temp_file_path, 'wb') as f:
            f.write(response.content)
        logger.info(f"Test image saved to: {temp_file_path}")
        
        # Create a new test product
        try:
            logger.info("Creating a new test product...")
            
            # Create product data
            product_data = {
                "name": "Test Product from API",
                "slug": "test-product-api",
                "price": 999.99,
                "originalPrice": 1099.99,
                "brand": "Test Brand",
                "model": "Test Model",
                "availability": "In Stock",
                "description": "This is a test product created via API",
                "specifications": json.dumps({
                    "CPU": "Test CPU",
                    "RAM": "Test RAM"
                })
            }
            
            # Create the product first without the image
            logger.info("Creating product record...")
            result = pb_client.collection('products').create(product_data)
            product_id = result.id
            logger.info(f"Created product with ID: {product_id}")
            
            # Now upload the image as a separate step
            logger.info("Uploading product thumbnail...")
            with open(temp_file_path, 'rb') as f:
                files = {
                    'image': ('test_image.jpg', f, 'image/jpeg')
                }
                
                # Use the direct API approach
                update_result = pb_client.send(f'/api/collections/products/records/{product_id}', {
                    'method': 'PATCH',
                    'files': files,
                })
                logger.info(f"Thumbnail upload response: {update_result}")
            
            # Upload an additional image to the gallery
            logger.info("Uploading image to gallery...")
            with open(temp_file_path, 'rb') as f:
                files = {
                    'images[]': ('gallery_image.jpg', f, 'image/jpeg')
                }
                
                # Use the direct API approach
                update_result = pb_client.send(f'/api/collections/products/records/{product_id}', {
                    'method': 'PATCH',
                    'files': files,
                })
                logger.info(f"Gallery upload response: {update_result}")
            
            logger.info(f"Test product created successfully with ID: {product_id}")
            logger.info(f"Check PocketBase admin UI to verify images are attached correctly.")
            
        except Exception as e:
            logger.error(f"Error creating test product: {str(e)}")
    
    logger.info("Test completed")

if __name__ == "__main__":
    test_create_product_with_image() 