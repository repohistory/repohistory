/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

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
      await supabase.from('repository_traffic').upsert(
        [
          {
            full_name: repo.full_name,
            date: view.timestamp,
            views_count: view.count,
            unique_views_count: view.uniques,
          },
        ],
        {
          onConflict: 'full_name, date',
        },
      );
    }

    // Insert or update clones data
    for (const clone of clonesData.clones) {
      await supabase.from('repository_traffic').upsert(
        [
          {
            full_name: repo.full_name,
            date: clone.timestamp,
            clones_count: clone.count,
            unique_clones_count: clone.uniques,
          },
        ],
        {
          onConflict: 'full_name, date',
        },
      );
    }
  }
}
