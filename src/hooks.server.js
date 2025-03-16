import PocketBase from 'pocketbase';

export const handle = async ({ event, resolve }) => {
  // Initialize PocketBase
  event.locals.pb = new PocketBase('http://127.0.0.1:8090');
  
  // Load the auth store from cookies
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  try {
    // Debug log the current auth state
    console.log('Auth State:', {
      isValid: event.locals.pb.authStore.isValid,
      token: event.locals.pb.authStore.token ? '[PRESENT]' : '[NONE]',
      model: event.locals.pb.authStore.model ? {
        id: event.locals.pb.authStore.model.id,
        email: event.locals.pb.authStore.model.email
      } : null
    });

    // Refresh the auth if needed
    if (event.locals.pb.authStore.isValid) {
      await event.locals.pb.collection('users').authRefresh();
    }
  } catch (err) {
    console.error('Auth refresh error:', err);
    event.locals.pb.authStore.clear();
  }

  const response = await resolve(event);

  // Set the cookie with the latest auth store state
  response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

  return response;
}; 