import { Octokit } from "octokit";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getUserOctokit(): Promise<Octokit> {
  const cookieStore = await cookies();
  const providerToken = cookieStore.get('provider_token')?.value;

  if (!providerToken) {
    redirect('/signin');
  }

  return new Octokit({
    auth: providerToken
  });
}