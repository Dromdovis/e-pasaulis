// src/scripts/populate-db.js
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
import { faker } from '@faker-js/faker';


dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);




  

// Complete list of electronics store categories
const categories = [
    { name: "Nešiojami kompiuteriai", slug: "nesiojami-kompiuteriai", description: "Plataus asortimento nešiojami kompiuteriai" },
    { name: "Stacionarūs kompiuteriai", slug: "stacionarus-kompiuteriai", description: "Galingi stacionarūs kompiuteriai" },
    { name: "Mobilieji telefonai", slug: "mobilieji-telefonai", description: "Išmanieji telefonai ir aksesuarai" },
    { name: "Planšetiniai kompiuteriai", slug: "plansetiniai-kompiuteriai", description: "Planšetės visiems poreikiams" },
    { name: "Monitoriai", slug: "monitoriai", description: "Aukštos kokybės monitoriai" },
    { name: "Klaviatūros", slug: "klaviaturos", description: "Mechaninės ir membraninės klaviatūros" },
    { name: "Pelės", slug: "peles", description: "Laidinės ir bevielės pelės" },
    { name: "Ausinės", slug: "ausines", description: "Laidinės ir bevielės ausinės" },
    { name: "Vaizdo plokštės", slug: "vaizdo-plokstes", description: "Galingos vaizdo plokštės" },
    { name: "Procesoriai", slug: "procesoriai", description: "Intel ir AMD procesoriai" },
    { name: "Atmintis", slug: "atmintis", description: "RAM ir ROM sprendimai" },
    { name: "Kietieji diskai", slug: "kietieji-diskai", description: "HDD ir SSD diskai" },
    { name: "Maitinimo blokai", slug: "maitinimo-blokai", description: "Patikimi maitinimo šaltiniai" },
    { name: "Aušintuvai", slug: "ausintuvai", description: "CPU ir sistemos aušintuvai" },
    { name: "Korpusai", slug: "korpusai", description: "Kompiuterių korpusai" },
    { name: "Pagrindinės plokštės", slug: "pagrindines-plokstes", description: "Intel ir AMD pagrindinės plokštės" },
    { name: "Tinklo įranga", slug: "tinklo-iranga", description: "Maršrutizatoriai ir tinklo plokštės" },
    { name: "Programinė įranga", slug: "programine-iranga", description: "Operacinės sistemos ir programos" },
    { name: "Žaidimų įranga", slug: "zaidimu-iranga", description: "Žaidimų konsolės ir aksesuarai" },
    { name: "Spausdintuvai", slug: "spausdintuvai", description: "Spausdintuvai ir skeneriai" }
];

// Product template data
const productTemplates = [
    { name: "Lenovo Legion 5", basePrice: 999.99 },
    { name: "ASUS ROG Strix", basePrice: 1299.99 },
    { name: "Dell XPS 13", basePrice: 1499.99 },
    { name: "iPhone 13 Pro", basePrice: 999.99 },
    { name: "Samsung Galaxy S21", basePrice: 899.99 },
    { name: "iPad Pro", basePrice: 799.99 },
    { name: "LG UltraGear", basePrice: 349.99 },
    { name: "Razer BlackWidow", basePrice: 129.99 },
    { name: "Logitech MX Master", basePrice: 99.99 },
    { name: "Sony WH-1000XM4", basePrice: 349.99 },
    { name: "NVIDIA RTX 3080", basePrice: 699.99 },
    { name: "AMD Ryzen 9", basePrice: 549.99 },
    { name: "Corsair Vengeance RAM", basePrice: 89.99 },
    { name: "Samsung 970 EVO", basePrice: 149.99 },
    { name: "Corsair RM850x", basePrice: 129.99 },
    { name: "Noctua NH-D15", basePrice: 89.99 },
    { name: "Fractal Design Meshify", basePrice: 89.99 },
    { name: "ASUS ROG Strix B550", basePrice: 179.99 },
    { name: "TP-Link Archer", basePrice: 79.99 },
    { name: "Windows 11 Pro", basePrice: 199.99 }
];

const specificationTemplates = {
    "Nešiojami kompiuteriai": [
        { name: "Procesorius", values: ["Intel Core i7", "AMD Ryzen 7", "Intel Core i9", "AMD Ryzen 9", "Intel Core i5"] },
        { name: "Atmintis", values: ["8GB DDR4", "16GB DDR4", "32GB DDR4", "64GB DDR4"] },
        { name: "Diskas", values: ["512GB NVMe SSD", "1TB NVMe SSD", "2TB NVMe SSD", "1TB SSD + 1TB HDD"] },
        { name: "Ekranas", values: ["15.6\" FHD", "14\" QHD", "17\" FHD", "16\" QHD", "13.3\" FHD"] },
        { name: "Vaizdo plokštė", values: ["NVIDIA RTX 3060", "NVIDIA RTX 3070", "NVIDIA RTX 3080", "AMD Radeon RX 6700M"] }
    ],
    "Mobilieji telefonai": [
        { name: "Ekranas", values: ["6.1\" OLED", "6.7\" AMOLED", "6.4\" LCD", "6.9\" AMOLED"] },
        { name: "Atmintis", values: ["128GB", "256GB", "512GB", "1TB"] },
        { name: "RAM", values: ["6GB", "8GB", "12GB", "16GB"] },
        { name: "Kamera", values: ["48MP + 12MP + 8MP", "108MP + 12MP + 10MP", "50MP + 12MP + 10MP"] },
        { name: "Baterija", values: ["4000mAh", "4500mAh", "5000mAh", "5500mAh"] }
    ],
    "Monitoriai": [
        { name: "Rezoliucija", values: ["1920x1080", "2560x1440", "3840x2160", "5120x1440"] },
        { name: "Atsinaujinimo dažnis", values: ["60Hz", "144Hz", "165Hz", "240Hz", "360Hz"] },
        { name: "Ekrano dydis", values: ["24\"", "27\"", "32\"", "34\" ultrawide", "49\" super ultrawide"] },
        { name: "Panelės tipas", values: ["IPS", "VA", "TN", "OLED"] },
        { name: "Atsako laikas", values: ["1ms", "4ms", "5ms"] }
    ],
    "Procesoriai": [
        { name: "Branduolių skaičius", values: ["6 branduoliai", "8 branduoliai", "12 branduoliai", "16 branduoliai"] },
        { name: "Dažnis", values: ["3.6GHz", "4.2GHz", "4.5GHz", "5.0GHz"] },
        { name: "Cache", values: ["32MB", "64MB", "96MB", "128MB"] },
        { name: "TDP", values: ["65W", "95W", "105W", "125W"] },
        { name: "Palaikoma RAM", values: ["DDR4-3200", "DDR4-3600", "DDR5-4800", "DDR5-5200"] }
    ],
    "Vaizdo plokštės": [
        { name: "Atmintis", values: ["8GB GDDR6", "10GB GDDR6X", "12GB GDDR6X", "16GB GDDR6X"] },
        { name: "Branduolių dažnis", values: ["1.5GHz", "1.7GHz", "1.9GHz", "2.1GHz"] },
        { name: "Energijos sąnaudos", values: ["200W", "250W", "300W", "350W"] },
        { name: "DirectX versija", values: ["DirectX 12", "DirectX 12 Ultimate"] },
        { name: "Aušinimo tipas", values: ["2 ventiliatoriai", "3 ventiliatoriai", "Skysčiu aušinama"] }
    ],
    "DEFAULT": [
        { name: "Garantija", values: ["12 mėnesių", "24 mėnesių", "36 mėnesių"] },
        { name: "Gamintojas", values: ["ASUS", "MSI", "Lenovo", "Dell", "HP", "Apple"] },
        { name: "Būklė", values: ["Nauja", "Demonstracinė", "Atnaujinta"] },
        { name: "Pristatymo laikas", values: ["1-2 d.d.", "2-3 d.d.", "3-5 d.d."] },
        { name: "Prekės likutis", values: ["Yra sandėlyje", "Pristatoma per 7 d.d.", "Pagal užsakymą"] }
    ]
};



async function initializeAdmin() {
    try {
      await pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL,
        process.env.POCKETBASE_ADMIN_PASSWORD
      );
    } catch (error) {
      console.error('Admin authentication failed:', error);
      process.exit(1);
    }
  }
  
  async function cleanCollections() {
    const collections = ['users', 'categories', 'products', 'specifications', 'reviews', 'orders'];
    
    for (const collection of collections) {
      try {
        const records = await pb.collection(collection).getFullList();
        for (const record of records) {
          await pb.collection(collection).delete(record.id);
        }
      } catch (error) {
        console.error(`Error cleaning ${collection}:`, error);
      }
    }
  }

async function createSpecifications(createdProducts, createdCategories) {
    for (const product of createdProducts) {
        const category = createdCategories.find(c => c.id === product.category);
        const templates = specificationTemplates[category.name] || specificationTemplates["DEFAULT"];
        
        for (const template of templates) {
            try {
                await pb.collection('specifications').create({
                    name: template.name,
                    value: template.values[Math.floor(Math.random() * template.values.length)],
                    product_id: product.id  // Explicit relation
                });
            } catch (error) {
                console.error('Specification creation error:', error);
            }
        }
    }
}

async function createReviews(createdProducts, users) {
    for (let i = 0; i < 20; i++) {
        try {
            await pb.collection('reviews').create({
                rating: faker.number.int({ min: 3, max: 5 }),
                comment: faker.lorem.paragraph(),
                product_id: createdProducts[Math.floor(Math.random() * createdProducts.length)].id,
                user_id: users[Math.floor(Math.random() * users.length)].id
            });
        } catch (error) {
            console.error('Review creation error:', error);
        }
    }
}

async function createOrders(users, createdProducts) {
    for (let i = 0; i < 10; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const orderItems = Array.from(
            { length: faker.number.int({ min: 1, max: 3 }) },
            () => ({
                product_id: createdProducts[Math.floor(Math.random() * createdProducts.length)].id,
                quantity: faker.number.int({ min: 1, max: 5 })
            })
        );

        try {
            await pb.collection('orders').create({
                user_id: user.id,
                items: orderItems,
                total: orderItems.reduce((sum, item) => {
                    const product = createdProducts.find(p => p.id === item.product_id);
                    return sum + (product.price * item.quantity);
                }, 0),
                status: faker.helpers.arrayElement(['pending', 'processing', 'shipped'])
            });
        } catch (error) {
            console.error('Order creation error:', error);
        }
    }
}

async function createUsers() {
    const users = [];
    for (let i = 0; i < 20; i++) {
        const password = faker.internet.password();
        const userData = {
            email: faker.internet.email(),
            password: password,
            passwordConfirm: password, // Use the same password
            name: faker.person.fullName()
        };
        try {
            const user = await pb.collection('users').create(userData);
            users.push(user);
        } catch (error) {
            console.error('Error creating user:', error.response);
        }
    }
    return users;
}

async function createProducts(createdCategories) {
    // Authenticate admin first
    
    const createdProducts = [];
    for (const template of productTemplates) {
        const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
        const product = {
            name: template.name,
            description: faker.commerce.productDescription(),
            price: Number((template.basePrice + faker.number.float({ min: 0, max: 200, precision: 0.01 })).toFixed(2)),
            stock: Number(faker.number.int({ min: 5, max: 100 })),
            category: category.id,
            slug: faker.helpers.slugify(template.name).toLowerCase()
        };
        
        try {
            const createdProduct = await pb.collection('products').create(product);
            createdProducts.push(createdProduct);
        } catch (error) {
            console.error('Product creation error:', {
                message: error.message,
                details: error.response?.data
            });
        }
    }
    return createdProducts;
}

async function createCategories() {
    const createdCategories = [];
    for (const category of categories) {
        try {
            const record = await pb.collection('categories').create(category);
            createdCategories.push(record);
        } catch (error) {
            console.error('Category creation error:', error);
        }
    }
    return createdCategories;
}

async function populateDatabase() {

    await initializeAdmin();
        

    await cleanCollections();

    try {
        const users = await createUsers();
        const createdCategories = await createCategories();
        const createdProducts = await createProducts(createdCategories);
        
        await createSpecifications(createdProducts, createdCategories);
        await createReviews(createdProducts, users);
        await createOrders(users, createdProducts);

        console.log('Database population completed successfully!');
    } catch (error) {
        console.error('Database population error:', error);
    }
}

populateDatabase();