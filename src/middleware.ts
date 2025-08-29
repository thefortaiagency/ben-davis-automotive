import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const authSession = request.cookies.get('auth-session');
    
    // If no auth session, redirect to login
    if (!authSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const session = JSON.parse(authSession.value);
      if (!session.loggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch {
      // Invalid session data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};