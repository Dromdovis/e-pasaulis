<script>
  // This page just shows a loading indicator while the server handles the OAuth callback
</script>

<div class="oauth-loading">
  <div class="spinner"></div>
  <p>Processing authentication...</p>
</div>

<style>
  .oauth-loading {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 5px solid #ddd;
    border-bottom-color: #4285f4;
    border-radius: 50%;
    animation: spinner 1s linear infinite;
  }

  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  p {
    color: #555;
    font-size: 1.2rem;
  }
</style> 