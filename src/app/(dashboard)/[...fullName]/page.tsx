import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StarsChartWrapper, ViewChartWrapper, CloneChartWrapper, ReferrersChartWrapper, PopularContentChartWrapper } from "@/components/charts/chart-wrappers";
import { StarsChartSkeleton } from "@/components/charts/stars-chart-skeleton";
import { ViewChartSkeleton } from "@/components/charts/view-chart-skeleton";
import { CloneChartSkeleton } from "@/components/charts/clone-chart-skeleton";
import { PopularChartsSkeleton } from "@/components/charts/popular-charts-skeleton";
import { getRepoOverview } from "@/utils/repo";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";

interface PageProps {
  params: Promise<{
    fullName: string[];
  }>;
}

export default async function RepoPage({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams.fullName || resolvedParams.fullName.length !== 2) {
    redirect("/");
  }

  const fullName = `${resolvedParams.fullName[0]}/${resolvedParams.fullName[1]}`;
  const [owner, repo] = fullName.split("/");
  const octokit = await getUserOctokit();
  const overview = await getRepoOverview(octokit, owner, repo);;

  return (
    <div className="container mx-auto p-4 sm:p-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          <Link
            href={`https://github.com/${fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline decoration-1"
          >
            {fullName}
          </Link>
        </h1>
        {overview.description && (
          <p className="text-muted-foreground">{overview.description}</p>
        )}
      </div>
      <Suspense fallback={<StarsChartSkeleton />}>
        <StarsChartWrapper fullName={overview.fullName} stargazersCount={overview.stars} />
      </Suspense>
      <Suspense fallback={<ViewChartSkeleton />}>
        <ViewChartWrapper fullName={fullName} repoId={overview.repoId} />
      </Suspense>
      <Suspense fallback={<CloneChartSkeleton />}>
        <CloneChartWrapper fullName={fullName} repoId={overview.repoId} />
      </Suspense>
      <Suspense fallback={<PopularChartsSkeleton />}>
        <ReferrersChartWrapper fullName={fullName} />
      </Suspense>
      <Suspense fallback={<PopularChartsSkeleton />}>
        <PopularContentChartWrapper fullName={fullName} />
      </Suspense>
    </div>
  );
}
