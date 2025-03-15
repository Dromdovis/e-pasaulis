/* eslint-env browser, node */
/* eslint no-undef: 0 */
// src/scripts/populate-db.js
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
import { faker } from '@faker-js/faker';

dotenv.config();

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Complete list of electronics store categories
const categories = [
    { 
        name_en: "Laptops",
        name_lt: "Nešiojami kompiuteriai",
        slug: "laptops",
        description_en: "Wide range of laptops",
        description_lt: "Plataus asortimento nešiojami kompiuteriai"
    },
    { 
        name_en: "Desktop Computers",
        name_lt: "Stacionarūs kompiuteriai",
        slug: "desktops",
        description_en: "Powerful desktop computers",
        description_lt: "Galingi stacionarūs kompiuteriai"
    },
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

// Helper function to translate Lithuanian category names and descriptions to English
function translateToEnglish(text) {
    const translations = {
        // Categories
        'Mobilieji telefonai': 'Mobile Phones',
        'Planšetiniai kompiuteriai': 'Tablets',
        'Monitoriai': 'Monitors',
        'Klaviatūros': 'Keyboards',
        'Pelės': 'Mice',
        'Ausinės': 'Headphones',
        'Vaizdo plokštės': 'Graphics Cards',
        'Procesoriai': 'Processors',
        'Atmintis': 'Memory',
        'Kietieji diskai': 'Hard Drives',
        'Maitinimo blokai': 'Power Supplies',
        'Aušintuvai': 'Cooling Systems',
        'Korpusai': 'Cases',
        'Pagrindinės plokštės': 'Motherboards',
        'Tinklo įranga': 'Network Equipment',
        'Programinė įranga': 'Software',
        'Žaidimų įranga': 'Gaming Equipment',
        'Spausdintuvai': 'Printers',
        // Descriptions
        'Išmanieji telefonai ir aksesuarai': 'Smartphones and accessories',
        'Planšetės visiems poreikiams': 'Tablets for all needs',
        'Aukštos kokybės monitoriai': 'High-quality monitors',
        'Mechaninės ir membraninės klaviatūros': 'Mechanical and membrane keyboards',
        'Laidinės ir bevielės pelės': 'Wired and wireless mice',
        'Laidinės ir bevielės ausinės': 'Wired and wireless headphones',
        'Galingos vaizdo plokštės': 'Powerful graphics cards',
        'Intel ir AMD procesoriai': 'Intel and AMD processors',
        'RAM ir ROM sprendimai': 'RAM and ROM solutions',
        'HDD ir SSD diskai': 'HDD and SSD drives',
        'Patikimi maitinimo šaltiniai': 'Reliable power supplies',
        'CPU ir sistemos aušintuvai': 'CPU and system coolers',
        'Kompiuterių korpusai': 'Computer cases',
        'Intel ir AMD pagrindinės plokštės': 'Intel and AMD motherboards',
        'Maršrutizatoriai ir tinklo plokštės': 'Routers and network cards',
        'Operacinės sistemos ir programos': 'Operating systems and software',
        'Žaidimų konsolės ir aksesuarai': 'Gaming consoles and accessories',
        'Spausdintuvai ir skeneriai': 'Printers and scanners'
    };
    
    return translations[text] || text;
}

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

async function createUsers() {
    const users = [];
    for (let i = 0; i < 20; i++) {
        const password = faker.internet.password();
        const userData = {
            email: faker.internet.email(),
            password: password,
            passwordConfirm: password, // Use the same password
            name: faker.person.fullName(),
            role: 'user' // Add the required role field
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

async function createCategories() {
    const createdCategories = [];
    
    for (const category of categories) {
        try {
            console.log('Creating category:', category);
            
            // If category has language-specific fields, use them
            // Otherwise, use the default name as Lithuanian and provide English translation
            const categoryData = {
                name_lt: category.name_lt || category.name,
                name_en: category.name_en || translateToEnglish(category.name),
                slug: category.slug,
                description_lt: category.description_lt || category.description,
                description_en: category.description_en || translateToEnglish(category.description)
            };

            const record = await pb.collection('categories').create(categoryData);
            console.log('Category created:', record.name_en);
            createdCategories.push(record);
        } catch (error) {
            console.error('Category creation error:', error);
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

        console.log('Database population completed successfully!');
    } catch (error) {
        console.error('Database population error:', error);
        process.exit(1);
    }
}

populateDatabase();