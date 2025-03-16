import { redirect } from '@sveltejs/kit';

export const actions = {
  login: async ({ request, locals }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    try {
      await locals.pb?.collection('users').authWithPassword(email, password);
      throw redirect(303, '/');
    } catch (error) {
      return {
        error: 'Invalid credentials'
      };
    }
  },

  google: async ({ url, locals }) => {
    try {
      const authMethods = await locals.pb?.collection('users').listAuthMethods();
      
      if (!authMethods?.authProviders?.length) {
        throw new Error('No auth providers available');
      }

      const googleProvider = authMethods.authProviders.find(p => p.name === 'google');
      if (!googleProvider) {
        throw new Error('Google auth provider not found');
      }

      // Redirect to the provider's authorization URL
      const redirectUrl = `${url.origin}/oauth`;
      throw redirect(303, `${googleProvider.authUrl}${redirectUrl}`);
    } catch (error) {
      console.error('Google OAuth initialization error:', error);
      return {
        error: error.message
      };
    }
  }
}; 