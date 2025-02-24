import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/csrf', '/test'];
  
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token');
  
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token
    const response = await fetch(`${request.nextUrl.origin}/api/auth/verifytoken`, {
      headers: {
        Cookie: `access_token=${accessToken.value}`
      }
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const data = await response.json();
    
    // Add user permissions to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-permissions', JSON.stringify(data.userPermissions));

    return NextResponse.next({
      headers: requestHeaders,
    });

  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
