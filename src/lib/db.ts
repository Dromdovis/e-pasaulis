import PocketBase from 'pocketbase';

if (!process.env.NEXT_PUBLIC_POCKETBASE_URL) {
  throw new Error('NEXT_PUBLIC_POCKETBASE_URL environment variable is not set');
}

// Create a singleton instance
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

// Disable auto-cancellation globally
pb.autoCancellation(false);

// Export as named export
export { pb }; 