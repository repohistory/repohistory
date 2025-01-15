/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  const hasAccessToken = request.cookies.get('access_token');

  if (hasAccessToken && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    !path.startsWith('/api') &&
    !path.startsWith('/login') &&
    !hasAccessToken
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\..*|favicon.ico).*)',
  ],
};
