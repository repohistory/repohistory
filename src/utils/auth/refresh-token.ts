import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface GitHubRefreshResponse {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
  expires_in?: number;
}

export async function refreshProviderToken(refreshToken: string): Promise<GitHubRefreshResponse | null> {
  try {
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
      return data.access_token ? data : null;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  return null;
}

