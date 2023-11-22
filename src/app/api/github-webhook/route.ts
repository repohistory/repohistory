import createInstallation from '@/services/createInstallation';
import deleteInstallation from '@/services/deleteInstallation';
import updateTraffic from '@/services/updateTraffic';
import { headers } from 'next/headers';
import * as crypto from 'crypto';

const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_GITHUB_WEBHOOK_SECRET;

const verifySignature = async (body: any, sig: any) => {
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');

  const trusted = Buffer.from(`sha256=${signature}`, 'ascii');
  const untrusted = Buffer.from(sig);

  return crypto.timingSafeEqual(trusted, untrusted);
};

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

  if (!verifySignature(res, headersList.get('x-hub-signature-256'))) {
    console.log('Invalid signature');
    return new Response('', {
      status: 401,
    });
  }

  console.log('Valid signature');

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
