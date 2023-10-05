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
        <a href={`https://github.com/${owner}/${repo}`}>{owner}/{repo}</a>
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
                pointHitRadius: 40,
                pointHoverRadius: 5,
                data: clonesTraffic.clones.map((clone: any) => clone.count),
                borderColor: '#38bc88',
                backgroundColor: '#38bc88',
                tension: 0.35,
              },
              {
                label: 'Unique Cloners',
                pointHitRadius: 40,
                pointHoverRadius: 5,
                data: clonesTraffic.clones.map((clone: any) => clone.uniques),
                borderColor: '#1d73f8',
                backgroundColor: '#1d73f8',
                tension: 0.35,
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
                pointHitRadius: 40,
                pointHoverRadius: 5,
                data: viewsTraffic.views.map((view: any) => view.count),
                borderColor: '#38bc88',
                backgroundColor: '#38bc88',
                tension: 0.35,
              },
              {
                label: 'Unique visitors',
                pointHitRadius: 40,
                pointHoverRadius: 5,
                data: viewsTraffic.views.map((view: any) => view.uniques),
                borderColor: '#1d73f8',
                backgroundColor: '#1d73f8',
                tension: 0.35,
              },
            ],
          }}
        />
      )}
    </div>
  );
}
