import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/login'];
// List of protected routes that require authentication
const protectedRoutes = ['/home', '/checkout', '/dashboard'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }); //check cookies for nexauth token
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Handle protected routes - redirect to login if no token
  if (isProtectedRoute && !token) {
    console.log('Protected route, no token found');
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname); //sets callback as a query parameter
    return NextResponse.redirect(redirectUrl);
  }

  // Handle public routes - redirect to home if already authenticated
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Update matcher to include all protected routes
  matcher: [
    '/login',
    '/home/:path*',
    '/checkout/:path*',
    '/dashboard/:path*',
    // Exclude all api routes, static files, and other assets
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
