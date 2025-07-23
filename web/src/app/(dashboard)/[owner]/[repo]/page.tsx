import { Suspense } from "react";
import { DateRangeProvider } from "@/contexts/date-range-context";
import type { Metadata } from "next";
import { StarsChartWrapper, ViewChartWrapper, CloneChartWrapper, ReferrersChartWrapper, PopularContentChartWrapper, ReleaseChartWrapper } from "@/components/charts/chart-wrappers";
import { RepoHeader } from "@/components/repo/repo-header";
import { getRepoInfo } from "@/utils/repo/info";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import { StarsChart } from "@/components/charts/stars-chart";
import { ViewChart } from "@/components/charts/view-chart";
import { CloneChart } from "@/components/charts/clone-chart";
import { ReferrersChart } from "@/components/charts/referrers-chart";
import { PopularContentChart } from "@/components/charts/popular-content-chart";
import { ReleaseChart } from "@/components/charts/release-chart";

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
    <DateRangeProvider fullName={repoInfo.full_name}>
      <div className="flex flex-col">
        <RepoHeader repoInfo={repoInfo} />
        <div className="container mx-auto p-4 sm:p-10 space-y-6">
          <Suspense fallback={<StarsChart isLoading />}>
            <StarsChartWrapper fullName={repoInfo.full_name} stargazersCount={repoInfo.stargazers_count} />
          </Suspense>
          <Suspense fallback={<ViewChart isLoading />}>
            <ViewChartWrapper fullName={fullName} repoId={repoInfo.id} />
          </Suspense>
          <Suspense fallback={<CloneChart isLoading />}>
            <CloneChartWrapper fullName={fullName} repoId={repoInfo.id} />
          </Suspense>
          <Suspense fallback={<ReferrersChart isLoading />}>
            <ReferrersChartWrapper fullName={fullName} repoId={repoInfo.id} />
          </Suspense>
          <Suspense fallback={<PopularContentChart isLoading />}>
            <PopularContentChartWrapper fullName={fullName} repoId={repoInfo.id} />
          </Suspense>
          <Suspense fallback={<ReleaseChart isLoading />}>
            <ReleaseChartWrapper fullName={fullName} />
          </Suspense>
        </div>
      </div>
    </DateRangeProvider>
  );
}
