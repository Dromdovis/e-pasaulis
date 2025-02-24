import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function seedData() {
  try {
    // Login as admin
    await pb.admins.authWithPassword(
      'dov.dromantas@kvkedu.lt',
      'Kaktusas1212!'
    );

    console.log('Creating categories...');
    const categories = [
      {
        name_en: 'Laptops',
        name_lt: 'Nešiojami kompiuteriai',
        slug: 'laptops',
        description_en: 'Portable computers for work and entertainment',
        description_lt: 'Nešiojami kompiuteriai darbui ir pramogoms'
      },
      {
        name_en: 'Desktops',
        name_lt: 'Staliniai kompiuteriai',
        slug: 'desktops',
        description_en: 'Powerful desktop computers',
        description_lt: 'Galingi staliniai kompiuteriai'
      },
      {
        name_en: 'Accessories',
        name_lt: 'Priedai',
        slug: 'accessories',
        description_en: 'Computer accessories and peripherals',
        description_lt: 'Kompiuterių priedai ir periferija'
      }
    ];

    const createdCategories = [];
    for (const category of categories) {
      const created = await pb.collection('categories').create(category);
      createdCategories.push(created);
      console.log(`Created category: ${category.name_en}`);
    }

    console.log('Creating products...');
    const products = [
      {
        name: 'Dell XPS 13',
        description: 'Premium ultrabook with InfinityEdge display',
        price: 1299.99,
        stock: 10,
        category: createdCategories[0].id,
        specifications: {
          cpu: 'Intel Core i7',
          ram: '16GB',
          storage: '512GB SSD'
        }
      },
      {
        name: 'HP Pavilion Gaming',
        description: 'Gaming desktop with RTX graphics',
        price: 999.99,
        stock: 5,
        category: createdCategories[1].id,
        specifications: {
          cpu: 'AMD Ryzen 7',
          ram: '32GB',
          storage: '1TB SSD'
        }
      },
      {
        name: 'Logitech MX Master 3',
        description: 'Advanced wireless mouse',
        price: 99.99,
        stock: 20,
        category: createdCategories[2].id,
        specifications: {
          connectivity: 'Bluetooth',
          battery: '70 days',
          dpi: '4000'
        }
      }
    ];

    for (const product of products) {
      await pb.collection('products').create(product);
      console.log(`Created product: ${product.name}`);
    }

    console.log('Successfully seeded the database!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData(); 