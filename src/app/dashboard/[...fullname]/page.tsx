'use client';

import Chart from '@/components/Chart';
import useClonesTraffic from '@/hooks/useClonesTraffic';
import useViewsTraffic from '@/hooks/useViewsTraffic';

export default function RepoPage({ params }: { params: { fullname: string } }) {
  const owner = params.fullname[0];
  const repo = params.fullname[1];
  const clonesTraffic = useClonesTraffic(owner, repo);
  const viewsTraffic = useViewsTraffic(owner, repo);

  return (
    <div
      className="mx-5 flex flex-col items-center justify-center gap-10
        py-10 sm:mx-10 xl:flex-row"
    >
      <Chart
        title="Git Clones"
        primaryLabel="Unique Cloners"
        secondaryLabel="Clones"
        data={{
          labels: clonesTraffic?.clones.map((clone: any) =>
            clone.timestamp.slice(5, 10).replace('-', '/'),
          ),
          datasets: [
            {
              label: 'Unique Cloners',
              data: clonesTraffic?.clones.map((clone: any) => clone.uniques),
              backgroundColor: '#62C3F8',
              borderRadius: 999,
              barThickness: 10,
            },
            {
              label: 'Clones',
              data: clonesTraffic?.clones.map((clone: any) => clone.count),
              backgroundColor: '#315c72',
              borderWidth: 0,
              borderRadius: 999,
              barThickness: 10,
            },
          ],
        }}
      />
      <Chart
        title="Visitors"
        primaryLabel="Unique Visitors"
        secondaryLabel="Views"
        data={{
          labels: viewsTraffic?.views.map((view: any) =>
            view.timestamp.slice(5, 10).replace('-', '/'),
          ),
          datasets: [
            {
              label: 'Unique Visitors',
              data: viewsTraffic?.views.map((view: any) => view.uniques),
              backgroundColor: '#62C3F8',
              borderWidth: 0,
              borderRadius: 999,
              barThickness: 10,
            },
            {
              label: 'Views',
              data: viewsTraffic?.views.map((view: any) => view.count),
              backgroundColor: '#315c72',
              borderWidth: 0,
              borderRadius: 999,
              barThickness: 10,
            },
          ],
        }}
      />
    </div>
  );
}
