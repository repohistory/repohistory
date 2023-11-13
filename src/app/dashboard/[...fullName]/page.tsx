import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import Overview from '@/components/Overview';
import { cookies } from 'next/headers';
import { app } from '@/utils/octokit';
import { fetchInstallationId } from '@/utils/dbHelpers';
import supabase from '@/utils/supabase';

export const dynamic = 'force-dynamic';

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
    throw error;
  }

  const userId = cookies().get('user_id')?.value ?? '';
  const installationId = await fetchInstallationId(userId);
  const octokit = await app.getInstallationOctokit(installationId);
  const { data: repo } = await octokit.request(`GET /repos/${fullName}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-5 sm:py-10 md:px-10 lg:px-20">
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <Overview
          repo={repo}
          viewsTotal={viewsTotal}
          clonesTotal={clonesTotal}
        />
        <LineChart repo={repo} userId={userId} />
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
