import { redirect } from '@sveltejs/kit';

async function downloadImageAsFile(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Convert Blob to File
    return new File([blob], 'avatar.jpg', {
      type: response.headers.get('content-type') || 'image/jpeg'
    });
  } catch (error) {
    console.error('Failed to download avatar:', error);
    return null;
  }
}

export const load = async ({ url, locals }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Check for OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    throw redirect(303, `/login?error=${error}`);
  }

  // Validate required parameters
  if (!code || !state) {
    console.error('Missing code or state');
    throw redirect(303, '/login?error=invalid_request');
  }

  try {
    // Get auth methods to verify the provider exists
    const authMethods = await locals.pb?.collection('users').listAuthMethods();
    if (!authMethods?.authProviders?.length) {
      throw new Error('No auth providers available');
    }

    const provider = authMethods.authProviders.find(p => p.name === 'google');
    if (!provider) {
      throw new Error('Google auth provider not found');
    }

    // Log redirect URL for debugging
    const redirectUrl = `${url.origin}/oauth`;
    console.log('Using redirect URL:', redirectUrl);
    console.log('PocketBase URL:', process.env.POCKETBASE_URL || 'Not set');

    // Exchange the code for user data
    const authData = await locals.pb?.collection('users').authWithOAuth2({
      provider: 'google',
      code: code,
      codeVerifier: provider.codeVerifier,
      redirectUrl: redirectUrl,
      createData: {
        role: 'user',
        emailVisibility: true,
        verified: false,
        // Let PocketBase handle these through the field map
        name: '', // Will be filled by OAuth2 name
        email: '' // Will be filled by OAuth2 email
      }
    });

    // Log the complete auth response for debugging
    console.log('Complete Auth Response:', {
      success: !!authData,
      userId: authData?.record?.id,
      email: authData?.record?.email,
      name: authData?.record?.name,
      meta: authData?.meta,
      record: authData?.record
    });

    if (!authData?.record) {
      throw new Error('Failed to get user data');
    }

    // If this is a new user (record was just created)
    if (authData.meta?.isNew) {
      // Download the avatar image if available
      let avatarFile = null;
      if (authData.meta?.avatarUrl) {
        avatarFile = await downloadImageAsFile(authData.meta.avatarUrl);
      }

      // Update the user record with the downloaded avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        try {
          await locals.pb?.collection('users').update(authData.record.id, formData);
          console.log('Successfully updated user avatar');
        } catch (updateError) {
          console.error('Failed to update avatar:', updateError);
        }
      }
    }

    // Successful authentication
    throw redirect(303, '/');
  } catch (error) {
    // Enhanced error logging
    console.error('OAuth error details:', {
      message: error.message,
      data: error.data,
      url: error.url,
      status: error.status,
      response: error.response,
      originalError: error
    });

    throw redirect(303, `/login?error=${encodeURIComponent(error.message)}`);
  }
}; 