'use client';

import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import useStargazers from '@/hooks/useStargazers';
import useTraffic from '@/hooks/useTraffic';
import { parseCSV } from '@/utils';
import { useEffect, useState } from 'react';

export default function RepoPage({ params }: { params: { fullname: string } }) {
  const owner = params.fullname[0];
  const repo = params.fullname[1];
  const traffic = useTraffic(owner, repo);
  const [clonesData, setClonesData] = useState<any>(null);
  const [viewsData, setViewsData] = useState<any>(null);
  const stargazers = useStargazers(owner, repo);

  const datasets = (label: string, data: any[], color: string) => ({
    label,
    data,
    backgroundColor: color,
    borderRadius: 999,
    barThickness: 10,
  });

  useEffect(() => {
    if (!traffic?.content) {
      return;
    }

    const data = parseCSV(atob(traffic.content));

    const time = data[0];
    const [, clonesTotal, clonesUnique, viewsTotal, viewsUnique] = data;

    setClonesData({
      labels: time,
      datasets: [
        datasets('Unique Cloners', clonesUnique, '#62C3F8'),
        datasets('Clones', clonesTotal, '#315C72'),
      ],
    });

    setViewsData({
      labels: time,
      datasets: [
        datasets('Unique Visitors', viewsUnique, '#62C3F8'),
        datasets('Views', viewsTotal, '#315C72'),
      ],
    });
  }, [traffic]);

  return (
    <div>
      <div
        className="my-10 mb-5 mt-10 flex flex-col flex-wrap items-center
          justify-center gap-10 sm:mx-10 xl:flex-row"
      >
        <BarChart
          title="Git Clones"
          primaryLabel="Unique Cloners"
          secondaryLabel="Clones"
          data={clonesData}
        />
        <BarChart
          title="Visitors"
          primaryLabel="Unique Visitors"
          secondaryLabel="Views"
          data={viewsData}
        />
        <LineChart title="Stargazers" data={stargazers} />
      </div>
    </div>
  );
}
