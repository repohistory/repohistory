import { NextResponse, type NextRequest } from 'next/server'
import { refreshProviderToken } from '@/utils/auth/refresh-token'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  let providerToken = request.cookies.get('provider_token')?.value;
  const providerRefreshToken = request.cookies.get('provider_refresh_token')?.value;

  if (!providerToken && providerRefreshToken) {
    const tokenData = await refreshProviderToken(providerRefreshToken);
    if (tokenData) {
      providerToken = tokenData.access_token;
      response.cookies.set('provider_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8 // 8 hours
      });

      if (tokenData.refresh_token) {
        response.cookies.set('provider_refresh_token', tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }
    }
  }

  if (
    !providerToken &&
    !providerRefreshToken &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  if (providerToken && request.nextUrl.pathname.startsWith('/signin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}
