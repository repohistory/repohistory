/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import getRepos from '../utils/getRepos';
import { getLimit } from '../utils/getLimit';
import { app } from '../utils/octokit';
import supabase from '../utils/supabase';

export default async function updateTraffic(installationId: number) {
  const octokit = await app.getInstallationOctokit(installationId);
  const repos = await getRepos([installationId]);
  const limit = await getLimit(installationId);

  if (repos.length > limit) {
    return;
  }

  for (const repo of repos) {
    console.log(repo.full_name, 'start');
    try {
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
      console.log(repo.full_name, 'done');
    } catch (error) {
      console.log(repo.full_name, 'error', error);
    }
  }
}
