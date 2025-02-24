import { NextResponse } from 'next/server';

export function middleware() {
  // Add any future middleware logic here if needed
  return NextResponse.next();
}

export const config = {
  matcher: [] // Empty matcher means middleware won't run for any routes
}; 