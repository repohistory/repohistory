import useSWR from 'swr';
import fetcher, { parseCSV } from '@/utils';
import { useEffect, useState } from 'react';

const datasets = (label: string, data: any[], color: string) => ({
  label,
  data,
  backgroundColor: color,
  borderRadius: 999,
  barPercentage: 0.7,
  maxBarThickness: 10,
});

export default function useTraffic(owner: string, repo: string) {
  const dataRepo = 'github-status';
  const branch = 'github-repo-stats';
  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${owner}/${dataRepo}/contents/${owner}/${repo}/ghrs-data/views_clones_aggregate.csv?ref=${branch}`,
    fetcher,
  );

  const [clonesData, setClonesData] = useState<any>(null);
  const [viewsData, setViewsData] = useState<any>(null);

  useEffect(() => {
    if (!data) {
      return;
    }

    const trafficData = parseCSV(atob(data.content));

    const time = trafficData[0];
    const [, clonesTotal, clonesUnique, viewsTotal, viewsUnique] = trafficData;

    setClonesData({
      labels: time,
      datasets: [
        datasets('Unique Cloners', clonesUnique, '#62C3F8'),
        datasets('Clones', clonesTotal, '#315C72'),
      ],
      total: clonesTotal.reduce((sum, clones) => sum + clones, 0),
    });

    setViewsData({
      labels: time,
      datasets: [
        datasets('Unique Visitors', viewsUnique, '#62C3F8'),
        datasets('Views', viewsTotal, '#315C72'),
      ],
      total: viewsTotal.reduce((sum, views) => sum + views, 0),
    });
  }, [data]);

  if (error || isLoading) {
    return { clonesData: null, viewsData: null };
  }

  return { clonesData, viewsData };
}
