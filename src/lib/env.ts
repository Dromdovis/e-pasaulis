const requiredEnvVars = [
  'NEXT_PUBLIC_POCKETBASE_URL',
  'POCKETBASE_ADMIN_EMAIL',
  'POCKETBASE_ADMIN_PASSWORD',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_DEFAULT_LOCALE'
] as const;

export function validateEnv() {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
  
  // Validate URL format
  const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (pocketbaseUrl && siteUrl) {
    try {
      new URL(pocketbaseUrl);
      new URL(siteUrl);
    } catch {
      throw new Error('Invalid URL format in environment variables');
    }
  }
} 