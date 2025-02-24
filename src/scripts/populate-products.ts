import { ProductScraper } from './product_scraper';
import { pb } from '@/lib/db';

async function populateProducts() {
  const scraper = new ProductScraper('https://your-target-site.com');
  
  // List of product URLs to scrape
  const productUrls = [
    'https://your-target-site.com/product1',
    'https://your-target-site.com/product2',
    // ...
  ];

  for (const url of productUrls) {
    const product = await scraper.scrape_product(url);
    if (product) {
      await scraper.upload_to_pocketbase(product, pb);
    }
  }
}

populateProducts().catch(console.error); 