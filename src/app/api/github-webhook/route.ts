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
    await sql`
      INSERT INTO users (github_user_id, installation_id)
      VALUES (${githubUserId}, ${installationId})
      ON CONFLICT (github_user_id) DO 
      UPDATE SET installation_id = EXCLUDED.installation_id
    `;
  } catch (error) {
    console.error('Error creating or updating user:', error);
    throw error;
  }
}

async function deleteUser(githubUserId: number) {
  try {
    await sql`
      DELETE FROM users
      WHERE github_user_id = ${githubUserId}
    `;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

async function updateTraffic(installationId: number) {
  const octokit = await app.getInstallationOctokit(installationId);
  const response = await octokit.request('GET /installation/repositories');
  const { repositories } = response.data;

  for (const repo of repositories) {
    const { data: viewsData } = await octokit.request(
      `GET /repos/${repo.full_name}/traffic/views`,
    );

    const { data: clonesData } = await octokit.request(
      `GET /repos/${repo.full_name}/traffic/clones`,
    );

    // Insert or update views data
    for (const view of viewsData.views) {
      await sql`
        INSERT INTO repository_traffic (
          full_name, date, views_count, unique_views_count
        ) VALUES (
          ${repo.full_name}, ${view.timestamp}, ${view.count}, ${view.uniques}
        ) ON CONFLICT (full_name, date) DO UPDATE SET
          views_count = EXCLUDED.views_count,
          unique_views_count = EXCLUDED.unique_views_count
      `;
    }

    // Insert or update clones data
    for (const clone of clonesData.clones) {
      await sql`
        INSERT INTO repository_traffic (
          full_name, date, clones_count, unique_clones_count
        ) VALUES (
          ${repo.full_name}, ${clone.timestamp}, ${clone.count}, ${clone.uniques}
        ) ON CONFLICT (full_name, date) DO UPDATE SET
          clones_count = EXCLUDED.clones_count,
          unique_clones_count = EXCLUDED.unique_clones_count
      `;
    }
  }
}

function processStarData(timestamps: any[]) {
  const dateCounts = timestamps.reduce((acc, timestamp) => {
    // Convert timestamp to a date string
    const date = timestamp.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  let cumulativeCount = 0;
  const cumulativeData = Object.keys(dateCounts)
    .sort()
    .map((date) => {
      cumulativeCount += dateCounts[date];
      return { [date]: cumulativeCount };
    });

  return cumulativeData;
}

async function updateStargarzers(installationId: number) {
  const octokit = await app.getInstallationOctokit(installationId);
  const response = await octokit.request('GET /installation/repositories');
  const { repositories } = response.data;
  for (const repo of repositories) {
    let page = 0;
    let stargazers = [];

    while (true) {
      const { data } = await octokit.request(
        `GET /repos/${repo.full_name}/stargazers`,
        {
          per_page: 100,
          page,
          headers: {
            accept: 'application/vnd.github.v3.star+json',
          },
        },
      );
      page += 1;
      const filteredData = data.map((d: any) => d.starred_at);
      stargazers.push(...filteredData);
      if (data.length === 0) {
        break;
      }
    }

    stargazers = processStarData(stargazers);

    for (const d of stargazers) {
      const [date, count] = Object.entries(d)[0];

      await sql`
        INSERT INTO repository_stars (full_name, date, stars_count)
        VALUES (${repo.full_name}, ${date}, ${count})
        ON CONFLICT (full_name, date) 
        DO UPDATE SET 
          stars_count = EXCLUDED.stars_count
      `;
    }
  }
}

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
    await updateStargarzers(installationId);
  }

  return new Response('', {
    status: 200,
  });
}
