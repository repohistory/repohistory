/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */

import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import Overview from '@/components/Overview';
import { cookies } from 'next/headers';
import { app } from '@/utils/octokit';
import { fetchInstallationIds } from '@/utils/dbHelpers';
import supabase from '@/utils/supabase';
import DoughnutChart from '@/components/DoughnutChart';

const colors = ['#62C3F8', '#4F9BC4', '#3A7391', '#264B5E'];

const datasets = (label: string, data: any[], color: string) => ({
  label,
  data,
  backgroundColor: color,
  borderRadius: 999,
  barPercentage: 0.7,
  maxBarThickness: 10,
});

export default async function RepoPage({
  params,
}: {
  params: { fullName: string };
}) {
  const fullName = `${params.fullName[0]}/${params.fullName[1]}`;

  let dates = [];
  let viewsCounts = [];
  let uniqueViewsCounts = [];
  let viewsTotal = 0;

  let clonesCounts = [];
  let uniqueClonesCounts = [];
  let clonesTotal = 0;

  let siteLabels = [];
  let contentLabels = [];

  try {
    const { data: trafficData, error } = await supabase
      .from('repository_traffic')
      .select('*')
      .eq('full_name', fullName)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    dates = trafficData.map((item) => item.date);
    viewsCounts = trafficData.map((item) => item.views_count);
    uniqueViewsCounts = trafficData.map((item) => item.unique_views_count);
    clonesCounts = trafficData.map((item) => item.clones_count);
    uniqueClonesCounts = trafficData.map((item) => item.unique_clones_count);

    // Summing clones_count
    const clonesResponse = await supabase
      .from('repository_traffic')
      .select('*')
      .eq('full_name', fullName)
      .order('date', { ascending: true })
      .select('clones_count');

    if (clonesResponse.error) {
      throw new Error(clonesResponse.error.message);
    }

    const clonesData = clonesResponse.data;
    clonesTotal = clonesData.reduce((acc, row) => acc + row.clones_count, 0);

    // Summing views_count
    const viewsResponse = await supabase
      .from('repository_traffic')
      .select('*')
      .eq('full_name', fullName)
      .order('date', { ascending: true })
      .select('views_count');

    if (viewsResponse.error) {
      throw new Error(viewsResponse.error.message);
    }

    const viewsData = viewsResponse.data;
    viewsTotal = viewsData.reduce((acc, row) => acc + row.views_count, 0);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
  }

  const userId = cookies().get('user_id')?.value ?? '';
  const installationIds = await fetchInstallationIds(userId);

  const fetchPromises: Promise<any>[] = [];
  let repo = null;
  for await (const installationId of installationIds) {
    try {
      const octokit = await app.getInstallationOctokit(installationId);

      const { data } = await octokit.request(`GET /repos/${fullName}`, {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (data) {
        repo = data;

        const { data: sites } = await octokit.request(
          `GET /repos/${repo.full_name}/traffic/popular/referrers`,
          {
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
        );
        siteLabels = sites.slice(0, 4).map((site: any, index: number) => ({
          name: site.referrer,
          count: site.count,
          uniques: site.uniques,
          color: colors[index],
        }));

        const { data: contents } = await octokit.request(
          `GET /repos/${repo.full_name}/traffic/popular/paths`,
          {
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
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
      }
    } catch (error) {
      console.error(
        'Error fetching repository data for installation ID:',
        installationId,
        error,
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-5 sm:py-10 md:px-10 lg:px-20">
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <Overview
          repo={repo}
          viewsTotal={viewsTotal}
          clonesTotal={clonesTotal}
        />
        <LineChart fetchPromises={fetchPromises} />
      </div>
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <BarChart
          title="Git Clones"
          primaryLabel="Unique Cloners"
          secondaryLabel="Clones"
          data={{
            labels: dates,
            datasets: [
              datasets('Unique Cloners', uniqueClonesCounts, '#62C3F8'),
              datasets('Clones', clonesCounts, '#315C72'),
            ],
          }}
        />
        <BarChart
          title="Visitors"
          primaryLabel="Unique Visitors"
          secondaryLabel="Views"
          data={{
            labels: dates,
            datasets: [
              datasets('Unique Visitors', uniqueViewsCounts, '#62C3F8'),
              datasets('Views', viewsCounts, '#315C72'),
            ],
          }}
        />
      </div>
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <DoughnutChart title="Referring Sites" labels={siteLabels} />
        <DoughnutChart title="Popular Content" labels={contentLabels} />
      </div>
    </div>
  );
}
