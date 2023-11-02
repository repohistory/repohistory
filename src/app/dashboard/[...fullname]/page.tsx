'use client';

import BarChart from '@/components/BarChart';
import Fork from '@/components/Icons/Fork';
import Issue from '@/components/Icons/Issue';
import Star from '@/components/Icons/Star';
import LineChart from '@/components/LineChart';
import useRepo from '@/hooks/useRepo';
import useStargazers from '@/hooks/useStargazers';
import useTraffic from '@/hooks/useTraffic';

export default function RepoPage({ params }: { params: { fullname: string } }) {
  const ownerName = params.fullname[0];
  const repoName = params.fullname[1];
  const { clonesData, viewsData } = useTraffic(ownerName, repoName);
  const stargazers = useStargazers(ownerName, repoName);
  const repo = useRepo(`${params.fullname[0]}/${params.fullname[1]}`);

  return (
    <div>
      <div
        className="my-10 mb-5 mt-10 flex flex-col flex-wrap items-center
          justify-center gap-10 sm:mx-10 xl:flex-row xl:items-start"
      >
        <div className="flex max-w-md flex-col gap-3 px-5 text-white sm:px-0">
          <h1 className="text-3xl font-bold">{repoName}</h1>
          <div>{repo?.description}</div>
          <div className="flex gap-5">
            <div className="flex items-center gap-2">
              <Star />
              {repo?.stargazers_count}
            </div>
            <div className="flex items-center gap-2">
              <Fork />
              {repo?.forks_count}
            </div>
            <div className="flex items-center gap-2">
              <Issue />
              {repo?.open_issues_count}
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-10">
            <div>
              <div className="text-center font-semibold ">Total Clones</div>
              <div className="text-center text-5xl font-bold">
                {clonesData?.total}
              </div>
            </div>
            <div>
              <div className="text-center font-semibold">Total Views</div>
              <div className="text-center text-5xl font-bold">
                {viewsData?.total}
              </div>
            </div>
          </div>
        </div>
        <LineChart title="Stargazers" data={stargazers} />
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
