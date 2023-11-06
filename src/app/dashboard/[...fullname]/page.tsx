'use client';

import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import Overview from '@/components/Overview';
import useStargazers from '@/hooks/useStargazers';
import useTraffic from '@/hooks/useTraffic';

export default function RepoPage({ params }: { params: { fullname: string } }) {
  const ownerName = params.fullname[0];
  const repoName = params.fullname[1];
  const { clonesData, viewsData } = useTraffic(ownerName, repoName);
  const stargazers = useStargazers(ownerName, repoName);

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-5 sm:py-10 md:px-10 lg:px-20">
      <div className="flex w-full flex-col gap-5 xl:flex-row">
        <Overview
          params={params}
          repoName={repoName}
          clonesData={clonesData}
          viewsData={viewsData}
        />
        <LineChart title="Stargazers" data={stargazers} />
      </div>
      <div className="flex w-full flex-col gap-5 xl:flex-row">
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
      </div>
    </div>
  );
}
