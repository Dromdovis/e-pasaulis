# Database Copy with Google Auth Credentials

This is a copy of the PocketBase database with all settings including Google authentication setup.

## Contents:
- Complete database files from pb_data
- Environment files containing Google auth credentials

## To Use This Copy:
1. Replace your pb_data directory with this copy
2. Copy the .env files to your project root
3. Ensure your Google OAuth configuration in Google Cloud Console includes:
   - Client ID from .env files
   - Proper redirect URIs:
     * http://localhost:3000/auth/callback/google
     * http://127.0.0.1:8090/api/collections/users/auth-with-oauth2
