/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */

import { redirect } from 'next/navigation';
import Overview from '@/components/Overview';
import TrafficCharts from '@/components/TrafficCharts';
import LineChart from '@/components/LineChart';
import PopularCharts from '@/components/PopularCharts';
import { app } from '@/utils/octokit';
import getInstallationIds from '@/utils/getInstallationIds';

export default async function RepoPage({
  params,
}: {
  params: { fullName: string };
}) {
  const installationIds = await getInstallationIds();
  const fullName = `${params.fullName[0]}/${params.fullName[1]}`;
  const fetchPromises: Promise<any>[] = [];
  let repo = null;
  let octokit = null;

  for await (const installationId of installationIds) {
    octokit = await app.getInstallationOctokit(installationId);

    const {
      data: { repositories: repos },
    } = await octokit.request(`GET /installation/repositories`);

    repo = repos.find((repository) => repository.full_name === fullName);

    if (repo) {
      break;
    }
  }

  if (octokit && repo) {
    const totalStars = Math.ceil(repo.stargazers_count / 100);
    for (let page = 1; page <= totalStars; page += 1) {
      fetchPromises.push(
        octokit.request(`GET /repos/${repo.full_name}/stargazers`, {
          per_page: 100,
          page,
          headers: {
            accept: 'application/vnd.github.v3.star+json',
          },
        }),
      );
    }
  }

  if (!repo) {
    redirect('/');
  }

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-5 sm:py-10 md:px-10 lg:px-20">
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <Overview repo={repo} />
        <LineChart fetchPromises={fetchPromises} />
      </div>
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <TrafficCharts fullName={fullName} />
      </div>
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <PopularCharts octokit={octokit} fullName={repo.full_name} />
      </div>
    </div>
  );
}
