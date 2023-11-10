/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { sql } from '@vercel/postgres';
import { headers } from 'next/headers';
import { App } from 'octokit';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

async function createUser(githubUserId: number, installationId: number) {
  try {
    const result = await sql`
      INSERT INTO users (github_user_id, installation_id)
      VALUES (${githubUserId}, ${installationId})
      ON CONFLICT (github_user_id) DO 
      UPDATE SET installation_id = EXCLUDED.installation_id
      RETURNING *;
    `;
    return result;
  } catch (error) {
    console.error('Error creating or updating user:', error);
    throw error;
  }
}

async function updateTraffic(installationId: number) {
  const octokit = await app.getInstallationOctokit(installationId);
  const response = await octokit.request('GET /installation/repositories');
  const { repositories } = response.data;

  for (const repo of repositories) {
    const owner = repo.owner.login;
    const repoName = repo.name;
    const repoId = repo.id; // Assuming the repository object has an id field.

    const { data: viewsData } = await octokit.request(
      'GET /repos/{owner}/{repo}/traffic/views',
      {
        owner,
        repo: repoName,
      },
    );

    const { data: clonesData } = await octokit.request(
      'GET /repos/{owner}/{repo}/traffic/clones',
      {
        owner,
        repo: repoName,
      },
    );

    // Insert or update views data
    for (const view of viewsData.views) {
      await sql`
        INSERT INTO repository_traffic (
          repository_id, date, views_count, unique_views_count
        ) VALUES (
          ${repoId}, ${view.timestamp}, ${view.count}, ${view.uniques}
        ) ON CONFLICT (repository_id, date) DO UPDATE SET
          views_count = EXCLUDED.views_count,
          unique_views_count = EXCLUDED.unique_views_count;
      `;
    }

    // Insert or update clones data
    for (const clone of clonesData.clones) {
      await sql`
        INSERT INTO repository_traffic (
          repository_id, date, clones_count, unique_clones_count
        ) VALUES (
          ${repoId}, ${clone.timestamp}, ${clone.count}, ${clone.uniques}
        ) ON CONFLICT (repository_id, date) DO UPDATE SET
          clones_count = EXCLUDED.clones_count,
          unique_clones_count = EXCLUDED.unique_clones_count;
      `;
    }
  }
}

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
  const githubUserId = res.sender.id;
  await createUser(githubUserId, installationId);
  await updateTraffic(installationId);

  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
