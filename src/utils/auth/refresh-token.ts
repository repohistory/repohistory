import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

interface GitHubRefreshResponse {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
  expires_in?: number;
}

export async function getValidProviderToken(): Promise<string> {
  const cookieStore = await cookies();
  const providerToken = cookieStore.get('provider_token')?.value;

  // If provider token exists, return it
  if (providerToken) {
    return providerToken;
  }

  // Try to refresh using refresh token
  const refreshToken = cookieStore.get('provider_refresh_token')?.value;

  if (!refreshToken) {
    // No refresh token available, redirect to signin
    redirect('/signin');
  }

  // Helper function to sign out and redirect
  const signOutAndRedirect = async (): Promise<never> => {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Sign out failed:', signOutError);
    }
    redirect('/signin');
  };

  try {
    // Try GitHub's refresh token API
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (response.ok) {
      const data: GitHubRefreshResponse = await response.json();

      if (data.access_token) {
        // Update cookies with new tokens
        cookieStore.set('provider_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 8 // 8 hours
        });

        // Update refresh token if a new one was provided
        if (data.refresh_token) {
          cookieStore.set('provider_refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }

        return data.access_token;
      }
    }

    // GitHub refresh token API failed or not available
    console.error('GitHub refresh token request failed:', response.status, response.statusText);
    await signOutAndRedirect();
  } catch (error) {
    // Only log non-redirect errors
    if (!error || typeof error !== 'object' || !('digest' in error) || !String(error.digest).includes('NEXT_REDIRECT')) {
      console.error('Token refresh failed:', error);
    }
    await signOutAndRedirect();
  }
  
  // This line should never be reached, but TypeScript requires it
  throw new Error('Unexpected code path in getValidProviderToken');
}
