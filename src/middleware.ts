/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Skip middleware for static files
  if (path.startsWith('/_next/static/')) {
    return NextResponse.next();
  }

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
