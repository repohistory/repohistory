/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { sql } from '@vercel/postgres';

export default async function updateTraffic(app: any, installationId: number) {
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
