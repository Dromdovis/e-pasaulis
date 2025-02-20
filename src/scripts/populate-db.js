// src/scripts/populate-db.js
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
import { faker } from '@faker-js/faker';


dotenv.config();

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');




  

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

// Product templates with proper categorization
const productTemplates = {
  "Nešiojami kompiuteriai": [
    {
      name: "Lenovo Legion Pro 7i",
      basePrice: 2499.99,
      specs: {
        "Procesorius": "Intel Core i9-13900HX",
        "Atmintis": "32GB DDR5-5600MHz",
        "Diskas": "2TB PCIe Gen4 NVMe SSD",
        "Ekranas": "16\" WQXGA (2560x1600) IPS 240Hz",
        "Vaizdo plokštė": "NVIDIA GeForce RTX 4090 16GB GDDR6",
        "Garantija": "36 mėnesiai",
        "Operacinė sistema": "Windows 11 Pro",
        "Baterija": "99.9Wh",
        "Svoris": "2.8 kg"
      }
    },
    {
      name: "ASUS ROG Zephyrus G14",
      basePrice: 1799.99,
      specs: {
        "Procesorius": "AMD Ryzen 9 7940HS",
        "Atmintis": "16GB DDR5-4800MHz",
        "Diskas": "1TB PCIe Gen4 NVMe SSD",
        "Ekranas": "14\" QHD+ (2560x1600) IPS 165Hz",
        "Vaizdo plokštė": "NVIDIA GeForce RTX 4070 8GB GDDR6",
        "Garantija": "24 mėnesiai",
        "Operacinė sistema": "Windows 11 Home",
        "Baterija": "76Wh",
        "Svoris": "1.72 kg"
      }
    },
    {
      name: "MacBook Pro 16",
      basePrice: 2899.99,
      specs: {
        "Procesorius": "Apple M2 Pro 12-core",
        "Atmintis": "32GB vieninga atmintis",
        "Diskas": "1TB SSD",
        "Ekranas": "16\" Liquid Retina XDR (3456x2234) 120Hz",
        "Vaizdo plokštė": "19-core GPU",
        "Garantija": "24 mėnesiai",
        "Operacinė sistema": "macOS Sonoma",
        "Baterija": "100Wh",
        "Svoris": "2.15 kg"
      }
    }
  ],
  "Vaizdo plokštės": [
    {
      name: "ASUS ROG STRIX GeForce RTX 4090 OC",
      basePrice: 1999.99,
      specs: {
        "Atmintis": "24GB GDDR6X",
        "Branduolių dažnis": "2.61 GHz (OC režimas)",
        "Atminties dažnis": "21 Gbps",
        "Energijos sąnaudos": "450W",
        "Rekomenduojamas PSU": "1000W",
        "Aušinimo tipas": "ROG patented vapor chamber with 3.5-slot heatsink",
        "Jungtys": "2x HDMI 2.1, 3x DisplayPort 1.4a",
        "Garantija": "36 mėnesiai",
        "Papildoma informacija": "0dB technologija, RGB Aura Sync"
      }
    },
    {
      name: "MSI Gaming X Trio GeForce RTX 4080 SUPER",
      basePrice: 1299.99,
      specs: {
        "Atmintis": "16GB GDDR6X",
        "Branduolių dažnis": "2.55 GHz (Boost)",
        "Atminties dažnis": "23 Gbps",
        "Energijos sąnaudos": "320W",
        "Rekomenduojamas PSU": "850W",
        "Aušinimo tipas": "TRI FROZR 3 su TORX Fan 5.0",
        "Jungtys": "1x HDMI 2.1, 3x DisplayPort 1.4a",
        "Garantija": "36 mėnesiai",
        "Papildoma informacija": "Zero Frozr, Mystic Light RGB"
      }
    }
  ],
  "Monitoriai": [
    {
      name: "Samsung Odyssey OLED G9",
      basePrice: 1599.99,
      specs: {
        "Ekrano dydis": "49\" ultrawide",
        "Rezoliucija": "5120x1440 (DQHD)",
        "Atsinaujinimo dažnis": "240Hz",
        "Panelės tipas": "OLED",
        "Atsako laikas": "0.03ms GtG",
        "HDR": "VESA DisplayHDR True Black 400",
        "Kontrastas": "1,000,000:1",
        "Jungtys": "1x DisplayPort 1.4, 1x Micro HDMI 2.1, USB hub",
        "Garantija": "24 mėnesiai",
        "Papildoma informacija": "AMD FreeSync Premium Pro, CoreSync"
      }
    },
    {
      name: "LG UltraGear 27GR95QE",
      basePrice: 899.99,
      specs: {
        "Ekrano dydis": "27\"",
        "Rezoliucija": "2560x1440 (QHD)",
        "Atsinaujinimo dažnis": "240Hz",
        "Panelės tipas": "OLED",
        "Atsako laikas": "0.03ms GtG",
        "HDR": "HDR10",
        "Kontrastas": "1,500,000:1",
        "Jungtys": "2x HDMI 2.1, 1x DisplayPort 1.4, USB hub",
        "Garantija": "24 mėnesiai",
        "Papildoma informacija": "NVIDIA G-SYNC, AMD FreeSync Premium"
      }
    }
  ],
  "Procesoriai": [
    {
      name: "Intel Core i9-14900K",
      basePrice: 589.99,
      specs: {
        "Branduoliai": "24 (8P + 16E)",
        "Gijos": "32",
        "Bazinis dažnis": "3.2 GHz",
        "Turbo dažnis": "6.0 GHz",
        "Cache": "36MB L3",
        "TDP": "125W",
        "Palaikoma RAM": "DDR4-3200 / DDR5-5600",
        "Integruota grafika": "Intel UHD Graphics 770",
        "Garantija": "36 mėnesiai",
        "Lizdas": "LGA 1700"
      }
    },
    {
      name: "AMD Ryzen 9 7950X3D",
      basePrice: 699.99,
      specs: {
        "Branduoliai": "16",
        "Gijos": "32",
        "Bazinis dažnis": "4.2 GHz",
        "Turbo dažnis": "5.7 GHz",
        "Cache": "144MB (128MB L3 + 16MB L2)",
        "TDP": "120W",
        "Palaikoma RAM": "DDR5-5200",
        "Integruota grafika": "AMD Radeon Graphics",
        "Garantija": "36 mėnesiai",
        "Lizdas": "AM5"
      }
    }
  ],
  "Mobilieji telefonai": [
    {
      name: "Samsung Galaxy S24 Ultra",
      basePrice: 1399.99,
      specs: {
        "Ekranas": "6.8\" Dynamic AMOLED 2X, 3088 x 1440",
        "Procesorius": "Snapdragon 8 Gen 3",
        "Atmintis": "12GB RAM, 512GB UFS 4.0",
        "Kamera": "200MP + 50MP + 12MP + 10MP",
        "Baterija": "5000mAh",
        "Operacinė sistema": "Android 14, One UI 6.1",
        "Garantija": "24 mėnesiai",
        "Papildoma informacija": "IP68, S Pen, 5G"
      }
    },
    {
      name: "iPhone 15 Pro Max",
      basePrice: 1299.99,
      specs: {
        "Ekranas": "6.7\" Super Retina XDR OLED",
        "Procesorius": "A17 Pro chip",
        "Atmintis": "8GB RAM, 256GB",
        "Kamera": "48MP + 12MP + 12MP",
        "Baterija": "4441mAh",
        "Operacinė sistema": "iOS 17",
        "Garantija": "12 mėnesiai",
        "Papildoma informacija": "Dynamic Island, USB-C, Titanium frame"
      }
    }
  ],
  "Klaviatūros": [
    {
      name: "Logitech G915 TKL",
      basePrice: 229.99,
      specs: {
        "Tipas": "Mechaninė",
        "Jungimas": "Bevielė LIGHTSPEED / Bluetooth",
        "Jungikliai": "GL Tactile",
        "Apšvietimas": "RGB per klavišą",
        "Baterijos laikas": "Iki 40 valandų",
        "Medžiaga": "Aliuminio-magnio lydinys",
        "Garantija": "24 mėnesiai",
        "Papildoma informacija": "Low-profile dizainas, Media kontrolės"
      }
    },
    {
      name: "Razer BlackWidow V4 Pro",
      basePrice: 229.99,
      specs: {
        "Tipas": "Mechaninė",
        "Jungimas": "Laidinis USB-C",
        "Jungikliai": "Razer Green",
        "Apšvietimas": "Razer Chroma RGB",
        "Papildomos funkcijos": "8 makro klavišai, skaitmeninis blokas",
        "Medžiaga": "Aliuminis, plastikas",
        "Garantija": "24 mėnesiai",
        "Papildoma informacija": "Riešo atrama, media valdikliai"
      }
    }
  ],
  "Pelės": [
    {
      name: "Logitech G Pro X Superlight",
      basePrice: 159.99,
      specs: {
        "Sensorius": "HERO 25K",
        "DPI": "25,600",
        "Svoris": "63g",
        "Jungimas": "LIGHTSPEED Wireless",
        "Baterijos laikas": "70 valandų",
        "Mygtukai": "5 programuojami",
        "Garantija": "24 mėnesiai",
        "Papildoma informacija": "PTFE kojelės, Zero-additive PTFE"
      }
    }
  ],
  "Ausinės": [
    {
      name: "SteelSeries Arctis Nova Pro Wireless",
      basePrice: 349.99,
      specs: {
        "Tipas": "Bevielės žaidimų ausinės",
        "Garsiakalbiai": "40mm Neodymium",
        "Dažnių diapazonas": "10-40,000 Hz",
        "Mikrofonas": "ClearCast Gen 2",
        "Baterija": "Dviguba keičiama sistema",
        "Jungimas": "2.4GHz / Bluetooth 5.0",
        "Garantija": "24 mėnesiai",
        "Papildoma informacija": "Active Noise Cancellation, ChatMix"
      }
    }
  ],
  "Pagrindinės plokštės": [
    {
      name: "ASUS ROG MAXIMUS Z790 HERO",
      basePrice: 629.99,
      specs: {
        "Procesorių lizdas": "LGA 1700",
        "Lustų rinkinys": "Intel Z790",
        "RAM palaikymas": "DDR5-7800+",
        "RAM slotai": "4x DIMM, max 128GB",
        "PCIe slotai": "2x PCIe 5.0 x16",
        "M.2 slotai": "5x PCIe 4.0",
        "LAN": "Intel 2.5Gb",
        "WiFi": "WiFi 6E",
        "Garantija": "36 mėnesiai",
        "Papildoma informacija": "Thunderbolt 4, USB 3.2 Gen 2x2"
      }
    }
  ],
  "Kietieji diskai": [
    {
      name: "Samsung 990 PRO 2TB",
      basePrice: 199.99,
      specs: {
        "Talpa": "2TB",
        "Sąsaja": "PCIe 4.0 x4 NVMe",
        "Skaitymo greitis": "7450 MB/s",
        "Rašymo greitis": "6900 MB/s",
        "Forma": "M.2 2280",
        "TBW": "1200TB",
        "DRAM": "2GB LPDDR4",
        "Garantija": "5 metai",
        "Papildoma informacija": "Samsung V-NAND, Pascal Controller"
      }
    }
  ],
  "Maitinimo blokai": [
    {
      name: "Corsair HX1500i",
      basePrice: 399.99,
      specs: {
        "Galia": "1500W",
        "Efektyvumas": "80 PLUS Platinum",
        "Modulinis": "Pilnai modulinis",
        "Ventiliatorius": "140mm Magnetic Levitation",
        "Apsaugos": "OVP, UVP, OCP, OTP, SCP",
        "Sertifikatai": "80 PLUS Platinum, Cybenetics Platinum",
        "Garantija": "10 metų",
        "Papildoma informacija": "iCUE suderinamumas, Zero RPM mode"
      }
    }
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
    const collections = ['reviews', 'orders', 'products', 'categories', 'users'];  // Changed order to respect relations
    
    for (const collection of collections) {
      try {
        const records = await pb.collection(collection).getFullList({
          requestKey: null
        });
        
        // Delete records one by one
        for (const record of records) {
          try {
            await pb.collection(collection).delete(record.id);
          } catch (error) {
            console.error(`Failed to delete record ${record.id} from ${collection}:`, error.response?.data);
          }
        }
        console.log(`Cleaned ${collection} collection`);
      } catch (error) {
        console.error(`Error cleaning ${collection}:`, error.response?.data);
      }
    }
  }

async function createReviews(createdProducts, users) {
    for (let i = 0; i < 20; i++) {
        try {
            const review = {
                rating: faker.number.int({ min: 3, max: 5 }),
                comment: faker.lorem.paragraph(),
                product: createdProducts[Math.floor(Math.random() * createdProducts.length)].id,
                user: users[Math.floor(Math.random() * users.length)].id
            };
            
            console.log('Creating review:', review);
            
            await pb.collection('reviews').create(review);
            console.log('Review created successfully');
        } catch (error) {
            console.error('Review creation error:', {
                message: error.message,
                data: error.response?.data,
                originalError: error.originalError
            });
        }
    }
}

async function createOrders(users, createdProducts) {
    for (let i = 0; i < 10; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const orderItems = Array.from(
            { length: faker.number.int({ min: 1, max: 3 }) },
            () => ({
                product: createdProducts[Math.floor(Math.random() * createdProducts.length)].id,
                quantity: faker.number.int({ min: 1, max: 5 })
            })
        );

        try {
            const order = {
                user_id: user.id,
                items: orderItems,
                total: orderItems.reduce((sum, item) => {
                    const product = createdProducts.find(p => p.id === item.product);
                    return sum + (product.price * item.quantity);
                }, 0),
                status: faker.helpers.arrayElement(['pending', 'processing', 'shipped'])
            };
            
            console.log('Creating order:', order);
            
            await pb.collection('orders').create(order);
            console.log('Order created successfully');
        } catch (error) {
            console.error('Order creation error:', {
                message: error.message,
                data: error.response?.data,
                originalError: error.originalError,
                attemptedData: order
            });
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
    const createdProducts = [];
    
    for (const category of createdCategories) {
        // Get the templates for this category
        const categoryTemplates = productTemplates[category.name] || [];
        
        // Create products for each category
        for (const template of categoryTemplates) {
            const priceVariation = faker.number.float({ min: -50, max: 100, precision: 0.01 });
            const product = {
                name: template.name,
                description: faker.commerce.productDescription(),
                price: Number((template.basePrice + priceVariation).toFixed(2)),
                stock: faker.number.int({ min: 0, max: 50 }),
                category: category.id,
                // Add the specifications field
                specifications: template.specs || {},
                slug: faker.helpers.slugify(template.name).toLowerCase()
            };

            try {
                console.log(`Creating product: ${product.name} with specs:`, product.specifications);
                const createdProduct = await pb.collection('products').create(product);
                createdProducts.push(createdProduct);
                console.log(`Created product: ${product.name} in category: ${category.name}`);
            } catch (error) {
                console.error(`Failed to create product ${product.name}:`, {
                    error: error.message,
                    data: error.data,
                    product: product
                });
            }
        }
    }
    return createdProducts;
}

async function createCategories() {
    const createdCategories = [];
    
    for (const category of categories) {
        try {
            // Log the category data being sent
            console.log('Creating category:', category);
            
            // Add required fields based on your schema
            const categoryData = {
                ...category,
                name: category.name,
                slug: category.slug,
                description: category.description
            };

            const record = await pb.collection('categories').create(categoryData);
            console.log('Category created:', record.name);
            createdCategories.push(record);
        } catch (error) {
            console.error('Category creation error:', {
                data: error.response?.data,
                message: error.message,
                category: category
            });
        }
    }
    return createdCategories;
}

async function populateDatabase() {
    console.log('Starting database population...');
    
    try {
        await initializeAdmin();
        console.log('Admin initialized');
        
        await cleanCollections();
        console.log('Collections cleaned');
        
        const users = await createUsers();
        console.log(`Created ${users.length} users`);
        
        const createdCategories = await createCategories();
        console.log(`Created ${createdCategories.length} categories`);
        
        if (createdCategories.length === 0) {
            throw new Error('No categories were created. Stopping population.');
        }
        
        const createdProducts = await createProducts(createdCategories);
        console.log(`Created ${createdProducts.length} products`);
        
        if (createdProducts.length > 0) {
            await createReviews(createdProducts, users);
            await createOrders(users, createdProducts);
        }

        console.log('Database population completed successfully!');
    } catch (error) {
        console.error('Database population error:', error);
        process.exit(1);
    }
}

populateDatabase();