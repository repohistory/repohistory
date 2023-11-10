import { App } from 'octokit';
import { headers } from 'next/headers';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const headersList = headers();
  const event = headersList.get('x-github-event');
  if (event !== 'installation') {
    return new Response('', { status: 200 });
  }

  const res = await req.json();
  if (res.action !== 'created') {
    return new Response('', { status: 200 });
  }

  const installationId = res.installation.id;
  const octokit = await app.getInstallationOctokit(installationId);
  const response = await octokit.request('GET /installation/repositories');
  console.log(response.data.repositories);

  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
