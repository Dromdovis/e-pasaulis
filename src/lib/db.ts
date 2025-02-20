import PocketBase from 'pocketbase';

// Create a singleton instance
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

export { pb }; 