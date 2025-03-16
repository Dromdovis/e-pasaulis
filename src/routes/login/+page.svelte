<script>
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { pb } from '$lib/db';

  /** @type {import('./$types').PageData} */
  export let data;

  let error = $page.url.searchParams.get('error') || '';
  let isLoading = false;

  async function handleGoogleLogin() {
    try {
      isLoading = true;
      error = '';

      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
        createData: {
          role: 'user',
          emailVisibility: true,
          verified: false,
          // name will be automatically mapped from OAuth2 full name
          // email will be automatically handled by PocketBase
        },
        requestKey: null // Disable auto-cancellation
      });

      // Redirect to home on success
      window.location.href = '/';
    } catch (err) {
      // Handle auto-cancellation errors gracefully
      if (err && typeof err === 'object' && 'status' in err && err.status === 0 && 
          'message' in err && typeof err.message === 'string' && err.message.includes('autocancelled')) {
        console.log('Auth flow was interrupted, but this may be normal during authentication');
        // Don't show error to the user as this is likely just part of the auth flow
        
        // Still check if we got authenticated
        setTimeout(() => {
          if (pb.authStore.isValid) {
            window.location.href = '/';
          }
        }, 500);
      } else {
        console.error('Google login error:', err);
        error = err.message || 'Failed to login with Google';
      }
    } finally {
      isLoading = false;
    }
  }
</script>

{#if error}
  <div class="error-message">
    {error}
  </div>
{/if}

<div class="login-container">
  <h1>Login</h1>

  <form method="POST" action="?/login" use:enhance>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required />
    </div>

    <button type="submit" class="login-button" disabled={isLoading}>Login</button>
  </form>

  <div class="divider">or</div>

  <button 
    type="button" 
    class="google-button" 
    on:click={handleGoogleLogin} 
    disabled={isLoading}
  >
    <svg class="google-icon" viewBox="0 0 24 24">
      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
    </svg>
    {#if isLoading}
      Connecting...
    {:else}
      Continue with Google
    {/if}
  </button>
</div>

<style>
  .login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: white;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .login-button {
    width: 100%;
    padding: 0.75rem;
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .login-button:hover:not(:disabled) {
    background: #357abd;
  }

  .divider {
    text-align: center;
    margin: 1rem 0;
    color: #666;
  }

  .google-button {
    width: 100%;
    padding: 0.75rem;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .google-button:hover:not(:disabled) {
    background: #f8f8f8;
  }

  .google-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .google-icon {
    width: 18px;
    height: 18px;
    fill: #4285f4;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    text-align: center;
  }
</style> 