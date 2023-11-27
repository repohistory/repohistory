/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */

import { redirect } from 'next/navigation';
import Overview from '@/components/Overview';
import TrafficCharts from '@/components/TrafficCharts';
import LineChart from '@/components/LineChart';
import DoughnutChart from '@/components/DoughnutChart';
import { app } from '@/utils/octokit';
import getInstallationIds from '@/utils/getInstallationIds';

const colors = ['#62C3F8', '#4F9BC4', '#3A7391', '#264B5E'];

export default async function RepoPage({
  params,
}: {
  params: { fullName: string };
}) {
  const fullName = `${params.fullName[0]}/${params.fullName[1]}`;

  let siteLabels = [];
  let contentLabels = [];

  const installationIds = await getInstallationIds();

  const fetchPromises: Promise<any>[] = [];
  let repo = null;
  for await (const installationId of installationIds) {
    try {
      const octokit = await app.getInstallationOctokit(installationId);

      const test = await octokit.request(`GET /installation/repositories`);

      repo = test.data.repositories.find(
        (repository: any) => repository.full_name === fullName,
      );

      if (!repo) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const { data: sites } = await octokit.request(
        `GET /repos/${repo.full_name}/traffic/popular/referrers`,
      );
      siteLabels = sites.slice(0, 4).map((site: any, index: number) => ({
        name: site.referrer,
        count: site.count,
        uniques: site.uniques,
        color: colors[index],
      }));

      const { data: contents } = await octokit.request(
        `GET /repos/${repo.full_name}/traffic/popular/paths`,
      );
      contentLabels = contents
        .slice(0, 4)
        .map((content: any, index: number) => {
          const truncatedTitle = content.title;
          return {
            name: truncatedTitle,
            path: `https://github.com${content.path}`,
            count: content.count,
            uniques: content.uniques,
            color: colors[index],
          };
        });

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

      break;
    } catch (error) {
      console.error(
        'Error fetching repository data for installation ID:',
        installationId,
        error,
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
        <DoughnutChart title="Referring Sites" labels={siteLabels} />
        <DoughnutChart title="Popular Content" labels={contentLabels} />
      </div>
    </div>
  );
}
