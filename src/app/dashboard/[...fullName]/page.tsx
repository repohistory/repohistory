/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import Overview from '@/components/Overview';
import { fetchInstallationId } from '@/utils/dbHelpers';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';
import { App } from 'octokit';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

const datasets = (label: string, data: any[], color: string) => ({
  label,
  data,
  backgroundColor: color,
  borderRadius: 999,
  barPercentage: 0.7,
  maxBarThickness: 10,
});

function processStarData(timestamps: any[]): [string[], number[]] {
  const dateCounts = timestamps.reduce((acc, timestamp) => {
    // Convert timestamp to a date string
    const date = timestamp.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  let cumulativeCount = 0;
  const cumulativeData = Object.keys(dateCounts).map((date) => {
    cumulativeCount += dateCounts[date];
    return { [date]: cumulativeCount };
  });

  const d = cumulativeData.map((item) => Object.keys(item)[0]);
  const c = cumulativeData.map((item) => item[Object.keys(item)[0]]);

  return [d, c];
}

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

  try {
    const { rows: trafficData } = await sql`
      SELECT * FROM repository_traffic WHERE full_name = ${fullName} ORDER BY date
    `;
    dates = trafficData.map((item) => item.date.toISOString().slice(0, 10));
    viewsCounts = trafficData.map((item) => item.views_count);
    uniqueViewsCounts = trafficData.map((item) => item.unique_views_count);
    clonesCounts = trafficData.map((item) => item.clones_count);
    uniqueClonesCounts = trafficData.map((item) => item.unique_clones_count);

    const { rows: viewsRows } = await sql`
      SELECT SUM(views_count) FROM repository_traffic WHERE full_name = ${fullName}
    `;
    viewsTotal = viewsRows[0].sum;

    const { rows: clonesRows } = await sql`
      SELECT SUM(clones_count) FROM repository_traffic WHERE full_name = ${fullName}
    `;
    clonesTotal = clonesRows[0].sum;
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    throw error;
  }

  const userId = cookies().get('user_id')?.value ?? '';
  const installationId = await fetchInstallationId(userId);
  const octokit = await app.getInstallationOctokit(installationId);
  let page = 1;
  const stars = [];

  while (true) {
    const { data } = await octokit.request(
      `GET /repos/${fullName}/stargazers`,
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
    stars.push(...filteredData);
    if (data.length === 0) {
      break;
    }
  }

  const [starDates, starsCount] = processStarData(stars);

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-5 sm:py-10 md:px-10 lg:px-20">
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <Overview
          fullName={fullName}
          viewsTotal={viewsTotal}
          clonesTotal={clonesTotal}
        />
        <LineChart
          title="Stargazers"
          data={{
            labels: starDates,
            datasets: [
              {
                data: starsCount,
                fill: true,
                pointRadius: 0,
                pointHitRadius: 30,
                label: 'Stargazers',
                borderColor: '#62C3F8',
                backgroundColor: '#62C3F810',
                tension: 0.5,
              },
            ],
          }}
        />
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
    </div>
  );
}
