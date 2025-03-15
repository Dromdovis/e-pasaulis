import { pb } from '../db';
import { AuthProvider, UserRole, AuthModel } from '@/types/auth';
import Cookies from 'js-cookie';
import type { OnStoreChangeFunc } from 'pocketbase';
import { useAuth } from '@/lib/auth';

// Define error type for better error handling
interface OAuth2Error {
  name?: string;
  message: string;
  stack?: string;
  data?: unknown;
  status?: number;
  response?: unknown;
  url?: string;
}

// Store the state in a more persistent way
export const GOOGLE_OAUTH_STATE_KEY = 'googleOAuthState';

/**
 * Validates and normalizes user roles from PocketBase
 * @param role - Raw role string from PocketBase
 * @returns Validated UserRole enum value
 */
const validateUserRole = (role: string): UserRole => {
  const normalizedRole = role.toLowerCase();
  
  switch (normalizedRole) {
    case 'admin':
      return UserRole.ADMIN;
    case 'super_admin':
      return UserRole.SUPER_ADMIN;
    default:
      return UserRole.USER;
  }
};

/**
 * Set a cookie with the OAuth state
 * @param state The state to store
 */
const setOAuthStateCookie = (state: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Set a secure cookie that expires in 10 minutes
    Cookies.set(GOOGLE_OAUTH_STATE_KEY, state, { 
      expires: 1/144, // 10 minutes in days
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
      path: '/' // Ensure cookie is available across all paths
    });
    console.log('Stored Google OAuth state in cookie:', state);
  } catch (error) {
    console.error('Failed to store OAuth state in cookie:', error);
  }
}

/**
 * Get Google OAuth2 authorization URL
 */
export const getGoogleAuthUrl = (): string => {
  // We don't need this anymore as PocketBase will handle the OAuth flow
  throw new Error('Use initiateGoogleLogin instead');
};

/**
 * Handle Google OAuth2 callback and authenticate user
 */
export const handleGoogleCallback = async (code: string, state?: string): Promise<{
  record: AuthModel;
  token: string;
}> => {
  // We don't need this anymore as PocketBase will handle the OAuth flow
  throw new Error('Use initiateGoogleLogin instead');
};

/**
 * Get the stored OAuth state from storage
 */
export const getStoredOAuthState = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try cookie first, then sessionStorage, then localStorage
  const cookieState = Cookies.get(GOOGLE_OAUTH_STATE_KEY);
  const sessionState = sessionStorage.getItem(GOOGLE_OAUTH_STATE_KEY);
  const localState = localStorage.getItem(GOOGLE_OAUTH_STATE_KEY);
  
  console.log('Retrieved OAuth state - Cookie:', cookieState, 'Session:', sessionState, 'Local:', localState);
  
  // Return the first non-null value found
  return cookieState || sessionState || localState;
};

/**
 * Clear the stored OAuth state
 */
export const clearOAuthState = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear from all storage mechanisms
    Cookies.remove(GOOGLE_OAUTH_STATE_KEY, { path: '/' }); // Important: specify path when removing
    sessionStorage.removeItem(GOOGLE_OAUTH_STATE_KEY);
    localStorage.removeItem(GOOGLE_OAUTH_STATE_KEY);
    console.log('Cleared OAuth state');
  } catch (error) {
    console.error('Failed to clear OAuth state:', error);
  }
};

/**
 * Initiate Google login flow
 */
export async function initiateGoogleLogin() {
  console.log('Starting Google OAuth flow...');
  
  try {
    // Generate a state parameter for CSRF protection
    const state = crypto.getRandomValues(new Uint8Array(16))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    
    setOAuthStateCookie(state);
    console.log('Generated OAuth state:', state);

    const authData = await pb.collection('users').authWithOAuth2({
      provider: 'google',
      scopes: ['profile', 'email'],
      createData: {
        email: '', // Will be set by OAuth
        emailVisibility: true,
        verified: true,
        role: 'user',
        name: '', // Will be populated from OAuth data
        avatar: '', // Will be updated later if available
        tokenKey: '', // Will be set by PocketBase
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      },
      onlyVerified: false,
      queryParams: {
        // Force account selection and consent screen
        prompt: 'select_account consent',
        // Pass state for CSRF protection
        state: state,
        // Request offline access for refresh token
        access_type: 'offline'
      }
    }).catch(error => {
      console.error('Google OAuth error details:', {
        message: error.message,
        data: error.data,
        url: error.url,
        status: error.status,
        response: error.response,
        originalError: error
      });
      throw error;
    });

    console.log('Received auth data:', { 
      userId: authData.record?.id,
      email: authData.record?.email,
      token: !!authData.token,
      meta: authData.meta,
      record: authData.record
    });

    if (!authData.token || !authData.record) {
      const error = new Error('No auth token or record received');
      console.error(error.message, { authData });
      clearOAuthState();
      window.location.replace('/login?error=missing_auth_data');
      return;
    }

    // Update the user record with additional data from OAuth
    try {
      console.log('Updating user record with meta:', authData.meta);
      const updatedRecord = await pb.collection('users').update(authData.record.id, {
        name: authData.meta?.name || authData.record.email?.split('@')[0] || '',
        avatarUrl: authData.meta?.avatarUrl || '',
        verified: true
      });
      console.log('Successfully updated user record:', updatedRecord);
    } catch (updateError) {
      console.error('Error updating user record:', {
        error: updateError,
        userId: authData.record.id,
        meta: authData.meta
      });
      // Continue anyway since the basic auth succeeded
    }

    // Store auth data in PocketBase's auth store
    console.log('Saving auth data to PocketBase store...');
    pb.authStore.save(authData.token, authData.record);
    console.log('Auth data saved successfully');
    
    // Clear the OAuth state since we're done
    clearOAuthState();
    
    // Redirect to intended path or home
    const intendedPath = useAuth.getState().intendedPath || '/';
    console.log('Redirecting to:', intendedPath);
    window.location.replace(intendedPath);
    
  } catch (err) {
    const error = err as OAuth2Error;
    console.error('Google OAuth error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      data: error.data,
      status: error.status,
      response: error.response
    });
    clearOAuthState();
    
    // Determine specific error type for better user feedback
    let errorType = 'auth_failed';
    if (error.status === 400) {
      errorType = 'invalid_request';
    } else if (error.message?.includes('state')) {
      errorType = 'state_mismatch';
    } else if (error.message?.includes('token')) {
      errorType = 'token_error';
    }
    
    window.location.replace(`/login?error=${errorType}`);
    throw error;
  }
}

/**
 * Initiate Google registration flow (same as login, but for new users)
 */
export const initiateGoogleRegistration = (): void => {
  initiateGoogleLogin();
}; 