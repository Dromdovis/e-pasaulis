import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pb } from './lib/db';
import { AuthService } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the user token from the cookie
    const token = request.cookies.get('pb_auth');
    
    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Check if user has admin role
      const isAdmin = await AuthService.isAdmin();
      
      if (!isAdmin) {
        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Handle any errors (e.g., invalid token)
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 