import createInstallation from '@/services/createInstallation';
import deleteInstallation from '@/services/deleteInstallation';
import updateTraffic from '@/services/updateTraffic';
import { headers } from 'next/headers';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const headersList = headers();
  const event = headersList.get('x-github-event');
  if (event === 'ping') {
    return new Response('', {
      status: 200,
    });
  }

  const res = await req.json();
  const installationId = res.installation.id;

  if (event === 'installation') {
    if (res.action === 'created') {
      const githubUserId = res.sender.id;
      await createInstallation(githubUserId, installationId);
    } else if (res.action === 'deleted') {
      await deleteInstallation(installationId);
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
