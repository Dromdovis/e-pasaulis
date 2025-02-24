import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
import { categoryTranslations } from '../translations/categories';

dotenv.config();

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

async function initializeAdmin() {
    try {
        await pb.admins.authWithPassword(
            process.env.POCKETBASE_ADMIN_EMAIL || 'admin@e-pasaulis.lt',
            process.env.POCKETBASE_ADMIN_PASSWORD || '12345678'
        );
    } catch (error) {
        console.error('Failed to authenticate as admin:', error);
        process.exit(1);
    }
}

async function updateCategoryTranslations() {
    console.log('Starting category translation updates...');
    
    try {
        // Get all existing categories
        const categories = await pb.collection('categories').getFullList();
        
        for (const category of categories) {
            // Find matching translation by comparing Lithuanian name
            const translationEntry = Object.entries(categoryTranslations)
                .find(([, trans]) => trans.lt === category.name_lt);
            
            if (translationEntry) {
                const [, translations] = translationEntry;
                
                try {
                    await pb.collection('categories').update(category.id, {
                        name_en: translations.en,
                        name_lt: translations.lt,
                        description_en: translations.description_en,
                        description_lt: translations.description_lt
                    });
                    console.log(`Updated category: ${translations.en} / ${translations.lt}`);
                } catch (error) {
                    console.error(`Failed to update category ${category.name_lt}:`, error);
                }
            } else {
                console.warn(`No translation found for category: ${category.name_lt}`);
            }
        }
        
        console.log('Category translation updates completed!');
    } catch (error) {
        console.error('Failed to update categories:', error);
        process.exit(1);
    }
}

async function main() {
    await initializeAdmin();
    await updateCategoryTranslations();
}

main(); 