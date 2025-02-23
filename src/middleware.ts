import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add any future middleware logic here if needed
  return NextResponse.next();
}

export const config = {
  matcher: [] // Empty matcher means middleware won't run for any routes
}; 