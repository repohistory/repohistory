import createUser from '@/services/createUser';
import deleteUser from '@/services/deleteUser';
import updateTraffic from '@/services/updateTraffic';
import { headers } from 'next/headers';

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
    await updateTraffic(installationId);
  }

  return new Response('', {
    status: 200,
  });
}
