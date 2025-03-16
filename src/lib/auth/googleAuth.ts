// This file previously contained Google authentication logic
// It has been removed to start fresh with authentication

// Import types to maintain interface compatibility
import { AuthModel, AuthProvider } from '@/types/auth';
import { pb } from '../db';

// Empty placeholder functions to prevent import errors
export const GOOGLE_OAUTH_STATE_KEY = 'googleOAuthState';

export const handleGoogleCallback = async (): Promise<{
  record: AuthModel;
  token: string;
}> => {
  throw new Error('Google authentication has been removed');
};

export const getStoredOAuthState = (): string | null => {
  return null;
};

export const clearOAuthState = (): void => {
  // No-op
};

// Define error type for better error handling
interface OAuth2Error {
  message: string;
  data?: unknown;
  status?: number;
  response?: unknown;
}

/**
 * Initiate Google OAuth login flow using PocketBase's popup approach
 */
export async function initiateGoogleLogin() {
  try {
    // Disable auto-cancellation for OAuth requests
    const options = { requestKey: null };
    
    const authData = await pb.collection('users').authWithOAuth2({
      provider: 'google',
      createData: {
        role: 'user',
        emailVisibility: true,
        verified: false,
        // name will be automatically mapped from OAuth2 full name
        // email will be automatically handled by PocketBase
      },
      ...options
    });

    console.log('OAuth Success:', {
      userId: authData.record?.id,
      email: authData.record?.email,
      name: authData.record?.name,
      meta: authData.meta // Log meta data to see what fields are available
    });

    // Try to redirect immediately if in a browser context
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }

    return authData;
  } catch (err) {
    const error = err as OAuth2Error;
    
    // Check if it's an auto-cancellation error
    if (error.status === 0 && error.message.includes('autocancelled')) {
      console.log('OAuth auto-cancellation detected. This usually happens during auth flow and is not a real error.');
      
      // Check if we still got authenticated despite the error
      if (typeof window !== 'undefined' && pb.authStore.isValid) {
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
      
      // Throw a different error so calling code knows to handle it differently
      throw new Error('auth_flow_interrupted');
    }
    
    console.error('OAuth Error:', {
      message: error.message,
      data: error.data,
      status: error.status,
      response: error.response
    });
    throw error;
  }
}

/**
 * Initiate Google registration flow (same as login, but for new users)
 */
export const initiateGoogleRegistration = initiateGoogleLogin; 