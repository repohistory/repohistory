/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { app } from '../utils/octokit';
import supabase from '../utils/supabase';

export default async function updateTraffic(installationId: number) {
  const octokit = await app.getInstallationOctokit(installationId);
  const repositories: any[] = [];

  await app.eachRepository({ installationId }, ({ repository }) => {
    repositories.push(repository);
  });

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('installation_id', installationId);

  const limit = error ? 2 : data[0].repository_limit ?? 2;

  if (repositories.length > limit) {
    return;
  }

  for (const repository of repositories) {
    console.log(repository.full_name);
    const { data: viewsData } = await octokit.request(
      `GET /repos/${repository.full_name}/traffic/views`,
    );

    const { data: clonesData } = await octokit.request(
      `GET /repos/${repository.full_name}/traffic/clones`,
    );

    // Insert or update views data
    for (const view of viewsData.views) {
      await supabase.from('repository_traffic').upsert(
        [
          {
            full_name: repository.full_name,
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
            full_name: repository.full_name,
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
