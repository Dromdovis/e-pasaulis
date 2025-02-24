import PocketBase from 'pocketbase';

const getBaseUrl = () => {
  // Always use the environment variable if available
  if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
    return process.env.NEXT_PUBLIC_POCKETBASE_URL;
  }
  
  // Fallback to localhost for development
  return 'http://127.0.0.1:8090';
};

// Create a single PocketBase instance
const pb = new PocketBase(getBaseUrl());

// Disable auto-cancellation for better request handling
pb.autoCancellation(false);

// Add error handling for requests
pb.beforeSend = function(url, options) {
  options.headers = {
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest',
  };
  return { url, options };
};

export const handlePocketBaseError = (error: any) => {
  console.error('PocketBase Error:', error);
  if (error.status === 401) {
    pb.authStore.clear();
  }
  throw error;
};

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

// Export the pb instance only once
export { pb }; 