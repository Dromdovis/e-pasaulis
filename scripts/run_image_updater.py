import asyncio
from update_product_images import ProductImageUpdater, main

if __name__ == "__main__":
    print("Starting product image updater...")
    asyncio.run(main())
    print("Product image update process completed!") 