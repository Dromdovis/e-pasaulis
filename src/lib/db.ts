import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

if (!pbUrl) {
  throw new Error('NEXT_PUBLIC_POCKETBASE_URL is not defined');
}

// Create a single PocketBase instance
const pb = new PocketBase(pbUrl);

// Log the URL being used (for debugging)
console.log('PocketBase URL:', pbUrl);

// Disable auto-cancellation globally
pb.autoCancellation(false);

// Validate auth state without causing infinite loops
export async function validateAuthState(): Promise<boolean> {
  try {
    if (!pb.authStore.isValid || !pb.authStore.model?.id) {
      return false;
    }
    
    // Only validate if we have a valid token and model
    return true;
  } catch (error) {
    console.error('Auth validation error:', error);
    return false;
  }
}

// Export the pb instance
export { pb }; 