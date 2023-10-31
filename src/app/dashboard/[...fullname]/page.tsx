'use client';

import Chart from '@/components/Chart';
import useTraffic from '@/hooks/useTraffic';
import { parseCSV } from '@/utils';
import { useEffect, useState } from 'react';

export default function RepoPage({ params }: { params: { fullname: string } }) {
  const owner = params.fullname[0];
  const repo = params.fullname[1];
  const traffic = useTraffic(owner, repo);
  const [clonesData, setClonesData] = useState<any>(null);
  const [viewsData, setViewsData] = useState<any>(null);

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

    const { time, clonesTotal, clonesUnique, viewsTotal, viewsUnique } =
      parseCSV(atob(traffic.content));

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
    <div
      className="mx-5 flex flex-col items-center justify-center gap-10
        py-10 sm:mx-10 xl:flex-row"
    >
      <Chart
        title="Git Clones"
        primaryLabel="Unique Cloners"
        secondaryLabel="Clones"
        data={clonesData}
      />
      <Chart
        title="Visitors"
        primaryLabel="Unique Visitors"
        secondaryLabel="Views"
        data={viewsData}
      />
    </div>
  );
}
