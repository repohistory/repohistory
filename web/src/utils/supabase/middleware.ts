import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { refreshProviderToken } from '@/utils/auth/refresh-token'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/error')
  ) {
    // no user, potentially respond by redirecting the user to the signin page
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    const response = NextResponse.redirect(url)

    // Delete cookies by setting them with past expiration
    response.cookies.set('provider_token', '', { expires: new Date(0) })
    response.cookies.set('provider_refresh_token', '', { expires: new Date(0) })

    return response
  }

  let providerToken = request.cookies.get('provider_token')?.value;
  const providerRefreshToken = request.cookies.get('provider_refresh_token')?.value;

  // no provider token but we can refresh it
  if (!providerToken && providerRefreshToken) {
    const tokenData = await refreshProviderToken(providerRefreshToken);
    if (tokenData) {
      providerToken = tokenData.access_token;

      // Set new tokens on the existing supabaseResponse
      supabaseResponse.cookies.set('provider_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8 // 8 hours
      });

      if (tokenData.refresh_token) {
        supabaseResponse.cookies.set('provider_refresh_token', tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 * 5 // 5 months
        });
      }

      return supabaseResponse;
    }
  }

  if (
    !providerToken &&
    !providerRefreshToken &&
    !request.nextUrl.pathname.startsWith('/signin')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    const response = NextResponse.redirect(url)

    response.cookies.set('provider_token', '', { expires: new Date(0) })
    response.cookies.set('provider_refresh_token', '', { expires: new Date(0) })

    return response
  }

  if (providerToken && request.nextUrl.pathname.startsWith('/signin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
