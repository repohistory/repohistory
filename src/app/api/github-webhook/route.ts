import createUser from '@/services/createUser';
import deleteUser from '@/services/deleteUser';
import updateStars from '@/services/updateStars';
import updateTraffic from '@/services/updateTraffic';
import { headers } from 'next/headers';
import { App } from 'octokit';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const headersList = headers();
  const event = headersList.get('x-github-event');
  const res = await req.json();

  const installationId = res.installation.id;

  if (event === 'installation') {
    const githubUserId = res.sender.id;

    if (res.action === 'created') {
      await createUser(githubUserId, installationId);
    } else if (res.action === 'deleted') {
      await deleteUser(githubUserId);
    }
  }

  if (
    (event === 'installation_repositories' && res.action === 'added') ||
    (event === 'installation' && res.action === 'created')
  ) {
    await updateTraffic(app, installationId);
    await updateStars(app, installationId);
  }

  return new Response('', {
    status: 200,
  });
}
