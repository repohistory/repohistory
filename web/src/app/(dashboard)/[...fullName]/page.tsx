import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StarsChartWrapper, ViewChartWrapper, CloneChartWrapper, ReferrersChartWrapper, PopularContentChartWrapper, ReleaseChartWrapper } from "@/components/charts/chart-wrappers";
import { StarsChartSkeleton } from "@/components/charts/stars-chart-skeleton";
import { AreaChartSkeleton } from "@/components/charts/area-chart-skeleton";
import { TrafficChartSkeleton } from "@/components/charts/traffic-chart-skeleton";
import { ReleaseChartSkeleton } from "@/components/charts/release-chart-skeleton";
import { ExportAllData } from "@/components/export-all-data";
import { getRepoInfo } from "@/utils/repo/info";
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
  const repoInfo = await getRepoInfo(octokit, owner, repo);

  return (
    <div className="container mx-auto p-4 sm:p-10 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
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
          <ExportAllData fullName={fullName} repoId={repoInfo.id} />
        </div>
        {repoInfo.description && (
          <p className="text-muted-foreground">{repoInfo.description}</p>
        )}
      </div>
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
  );
}
