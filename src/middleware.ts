import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebase-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isPublisherPage = request.nextUrl.pathname.startsWith('/publisher');

  // Public paths
  if (request.nextUrl.pathname.startsWith('/api/serve')) {
    return NextResponse.next();
  }

  // Auth control
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    // Redirect to appropriate dashboard
    // Role kontrolü yapılacak
    return NextResponse.redirect(new URL('/publisher', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/serve).*)'],
};
