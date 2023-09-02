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
    <div className="mx-5 py-10 sm:mx-10">
      <div className="text-center text-2xl font-semibold text-white">
        {owner}/{repo}
      </div>
      {clonesTraffic && (
        <Chart
          title="Git Clones"
          data={{
            labels: clonesTraffic.clones.map((clone: any) =>
              clone.timestamp.slice(5, 10).replace('-', '/'),
            ),
            datasets: [
              {
                label: 'Clones',
                data: clonesTraffic.clones.map((clone: any) => clone.count),
                borderColor: '#238636',
                backgroundColor: '#238636',
              },
              {
                label: 'Unique Cloners',
                data: clonesTraffic.clones.map((clone: any) => clone.uniques),
                borderColor: '#1f6feb',
                backgroundColor: '#1f6feb',
              },
            ],
          }}
        />
      )}
      {viewsTraffic && (
        <Chart
          title="Visitors"
          data={{
            labels: viewsTraffic.views.map((view: any) =>
              view.timestamp.slice(5, 10).replace('-', '/'),
            ),
            datasets: [
              {
                label: 'Views',
                data: viewsTraffic.views.map((view: any) => view.count),
                borderColor: '#238636',
                backgroundColor: '#238636',
              },
              {
                label: 'Unique visitors',
                data: viewsTraffic.views.map((view: any) => view.uniques),
                borderColor: '#1f6feb',
                backgroundColor: '#1f6feb',
              },
            ],
          }}
        />
      )}
    </div>
  );
}
