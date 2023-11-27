/* eslint-disable import/prefer-default-export */
import { cookies } from 'next/headers';
import { App, Octokit } from 'octokit';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
export const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

export async function getUserOctokit() {
  const auth = cookies().get('access_token')?.value;
  return new Octokit({ auth });
}
