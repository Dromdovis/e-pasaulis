import PocketBase, { ClientResponseError } from 'pocketbase';

const getBaseUrl = () => {
  // Always use the environment variable if available
  if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
    return process.env.NEXT_PUBLIC_POCKETBASE_URL;
  }
  
  // Check if we're in development or production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_POCKETBASE_URL must be set in production');
  }
  
  // Fallback to localhost for development only
  return 'http://127.0.0.1:8090';
};

// Create a single PocketBase instance
const pb = new PocketBase(getBaseUrl());

// Disable auto-cancellation for better request handling
pb.autoCancellation(false);

// Add error handling and request interceptor
pb.beforeSend = function(url, options) {
  // Add custom headers
  options.headers = {
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest',
  };

  // Add timeout
  options.signal = AbortSignal.timeout(30000); // 30 second timeout

  return { url, options };
};

// Enhanced error handling
export const handlePocketBaseError = (error: unknown) => {
  if (error instanceof ClientResponseError) {
    console.error('PocketBase Error:', {
      url: error.url,
      status: error.status,
      message: error.message,
      data: error.data
    });

    // Handle authentication errors
    if (error.status === 401) {
      pb.authStore.clear();
      // You might want to redirect to login page here
    }

    // Handle rate limiting
    if (error.status === 429) {
      console.warn('Rate limited by PocketBase');
    }
  } else {
    console.error('Unknown error:', error);
  }
  throw error;
};

// Validate auth state without causing infinite loops
export async function validateAuthState(): Promise<boolean> {
  try {
    if (!pb.authStore.isValid || !pb.authStore.model?.id) {
      return false;
    }
    
    // Check if the token is about to expire (within 5 minutes)
    const tokenExp = pb.authStore.model.collectionId ? 
      new Date(pb.authStore.model.updated).getTime() + (30 * 24 * 60 * 60 * 1000) : // 30 days for users
      new Date(pb.authStore.model.updated).getTime() + (14 * 24 * 60 * 60 * 1000);  // 14 days for admins
    
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() + fiveMinutes >= tokenExp) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth validation error:', error);
    return false;
  }
}

// Export the pb instance
export { pb }; 