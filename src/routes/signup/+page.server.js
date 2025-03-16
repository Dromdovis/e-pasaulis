import { redirect } from '@sveltejs/kit';

export const actions = {
  OAuth2: async ({ cookies, url, locals }) => {
    try {
      const authMethods = await locals.pb?.collection('users').listAuthMethods();
      
      if (!authMethods?.authProviders?.length) {
        throw redirect(303, '/login?error=no_providers');
      }

      // Get the Google provider - it should be the first one
      const googleProvider = authMethods.authProviders.find(p => p.name === 'google');
      
      if (!googleProvider) {
        throw redirect(303, '/login?error=no_google_provider');
      }

      const redirectURL = `${url.origin}/oauth`;
      
      // Store the provider's state in a cookie
      cookies.set('oauth_state', googleProvider.state, {
        path: '/',
        secure: url.protocol === 'https:',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 10 // 10 minutes
      });

      // Redirect to the provider's authorization URL
      throw redirect(303, `${googleProvider.authUrl}${redirectURL}`);
    } catch (error) {
      console.error('OAuth2 error:', error);
      throw redirect(303, `/login?error=${error.message}`);
    }
  }
}; 