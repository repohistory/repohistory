import BarChart from '@/components/BarChart';
import Overview from '@/components/Overview';
import { sql } from '@vercel/postgres';

const datasets = (label: string, data: any[], color: string) => ({
  label,
  data,
  backgroundColor: color,
  borderRadius: 999,
  barPercentage: 0.7,
  maxBarThickness: 10,
});

export default async function RepoPage({ params }: { params: { id: string } }) {
  const id = params.id[0];
  let dates = [];
  let viewsCounts = [];
  let uniqueViewsCounts = [];
  let clonesCounts = [];
  let uniqueClonesCounts = [];

  try {
    const { rows: trafficData } = await sql`
      SELECT *
      FROM repository_traffic
      WHERE repository_id = ${id};
    `;
    dates = trafficData.map((item) => item.date.toISOString().slice(0, 10));
    viewsCounts = trafficData.map((item) => item.views_count);
    uniqueViewsCounts = trafficData.map((item) => item.unique_views_count);
    clonesCounts = trafficData.map((item) => item.clones_count);
    uniqueClonesCounts = trafficData.map((item) => item.unique_clones_count);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    throw error;
  }

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-5 sm:py-10 md:px-10 lg:px-20">
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <Overview id={id} />
        {/*  <LineChart title="Stargazers" data={stargazers} />  */}
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
