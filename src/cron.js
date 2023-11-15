const { createClient } = require('@supabase/supabase-js');
const { App } = require('@octokit/app');

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function updateTraffic(installationId) {
  const octokit = await app.getInstallationOctokit(installationId);
  const repositories = [];

  await app.eachRepository({ installationId }, ({ repository }) => {
    repositories.push(repository);
  });

  if (repositories.length > 5) {
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

async function updateAllTraffic() {
  const { data, error } = await supabase
    .from('users')
    .select('installation_id');

  if (error) {
    return;
  }

  const installations = data.map((d) => d.installation_id);

  for (const installation of installations) {
    await updateTraffic(installation);
  }
}

updateAllTraffic();
