import DoughnutChart from '@/components/DoughnutChart';

const colors = ['#62C3F8', '#4F9BC4', '#3A7391', '#264B5E'];

export default async function PopularCharts({
  octokit,
  fullName,
}: {
  octokit: any;
  fullName: string;
}) {
  const { data: sites } = await octokit.request(
    `GET /repos/${fullName}/traffic/popular/referrers`,
  );
  const siteLabels = sites.slice(0, 4).map((site: any, index: number) => ({
    name: site.referrer,
    count: site.count,
    uniques: site.uniques,
    color: colors[index],
  }));

  const { data: contents } = await octokit.request(
    `GET /repos/${fullName}/traffic/popular/paths`,
  );
  const contentLabels = contents
    .slice(0, 4)
    .map((content: any, index: number) => ({
      name: content.title,
      path: `https://github.com${content.path}`,
      count: content.count,
      uniques: content.uniques,
      color: colors[index],
    }));
  return (
    <>
      <DoughnutChart title="Referring Sites" labels={siteLabels} />
      <DoughnutChart title="Popular Content" labels={contentLabels} />
    </>
  );
}
