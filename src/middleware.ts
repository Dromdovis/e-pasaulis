import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Supported languages 
const locales = ['en', 'lt', 'ru'];
const defaultLocale = 'en';

// Function to get locale from request
function getLocale(request: NextRequest): string {
  // Check for language cookie first
  const languageCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (languageCookie && locales.includes(languageCookie)) {
    return languageCookie;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // The Negotiator library expects the headers object
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, defaultLocale);
  
  return locale;
}

export function middleware(request: NextRequest) {
  // Get locale from cookie or headers
  const locale = getLocale(request);
  
  // Store locale in a cookie for future requests
  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', locale);
  
  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 