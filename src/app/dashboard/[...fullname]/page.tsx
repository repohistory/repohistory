'use client';

import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import useStargazers from '@/hooks/useStargazers';
import useTraffic from '@/hooks/useTraffic';

export default function RepoPage({ params }: { params: { fullname: string } }) {
  const owner = params.fullname[0];
  const repo = params.fullname[1];
  const { clonesData, viewsData } = useTraffic(owner, repo);
  const stargazers = useStargazers(owner, repo);

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
