import { Suspense } from "react";
import { DateRangeProvider } from "@/contexts/date-range-context";
import type { Metadata } from "next";
import { StarsChartWrapper, ViewChartWrapper, CloneChartWrapper, ReferrersChartWrapper, PopularContentChartWrapper, ReleaseChartWrapper } from "@/components/charts/chart-wrappers";
import { StarsChartSkeleton } from "@/components/charts/stars-chart-skeleton";
import { AreaChartSkeleton } from "@/components/charts/area-chart-skeleton";
import { TrafficChartSkeleton } from "@/components/charts/traffic-chart-skeleton";
import { ReleaseChartSkeleton } from "@/components/charts/release-chart-skeleton";
import { RepoHeader } from "@/components/repo/repo-header";
import { getRepoInfo } from "@/utils/repo/info";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";

interface PageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params;

  return {
    title: `${owner}/${repo} | Repohistory`,
  };
}

export default async function RepoPage({ params }: PageProps) {
  const { owner, repo } = await params;

  if (owner === 'icons') {
    return;
  }

  const fullName = `${owner}/${repo}`;
  const octokit = await getUserOctokit();
  const repoInfo = await getRepoInfo(octokit, owner, repo);

  return (
    <DateRangeProvider>
      <div className="flex flex-col">
        <RepoHeader repoInfo={repoInfo} />
        <div className="container mx-auto p-4 sm:p-10 space-y-6">
          <Suspense fallback={<StarsChartSkeleton />}>
            <StarsChartWrapper fullName={repoInfo.full_name} stargazersCount={repoInfo.stargazers_count} />
          </Suspense>
          <Suspense fallback={<AreaChartSkeleton type="views" />}>
            <ViewChartWrapper fullName={fullName} repoId={repoInfo.id} />
          </Suspense>
          <Suspense fallback={<AreaChartSkeleton type="clones" />}>
            <CloneChartWrapper fullName={fullName} repoId={repoInfo.id} />
          </Suspense>
          <Suspense fallback={<TrafficChartSkeleton type="referrers" />}>
            <ReferrersChartWrapper fullName={fullName} repoId={repoInfo.id} />
          </Suspense>
          <Suspense fallback={<TrafficChartSkeleton type="popular-content" />}>
            <PopularContentChartWrapper fullName={fullName} repoId={repoInfo.id} />
          </Suspense>
          <Suspense fallback={<ReleaseChartSkeleton />}>
            <ReleaseChartWrapper fullName={fullName} />
          </Suspense>
        </div>
      </div>
    </DateRangeProvider>
  );
}
