import { Suspense } from "react";
import { DateRangeProvider } from "@/contexts/date-range-context";
import { OwnerStarsChartWrapper, OwnerViewChartWrapper, OwnerCloneChartWrapper, OwnerReferrersChartWrapper, OwnerPopularContentChartWrapper } from "@/components/charts/owner-chart-wrappers";
import { Navbar } from "@/components/layout/navbar";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import { getRepos } from "@/utils/octokit/get-repos";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { StarsChart } from "@/components/charts/stars-chart";
import { ViewChart } from "@/components/charts/view-chart";
import { CloneChart } from "@/components/charts/clone-chart";
import { ReferrersChart } from "@/components/charts/referrers-chart";
import { PopularContentChart } from "@/components/charts/popular-content-chart";

interface PageProps {
  params: Promise<{
    owner: string;
  }>;
}

export default async function OwnerPage({ params }: PageProps) {
  const { owner } = await params;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  const octokit = await getUserOctokit();
  const { reposByOwner } = await getRepos(octokit);

  const ownerRepos = reposByOwner[owner];
  if (!ownerRepos || ownerRepos.length === 0) {
    redirect("/");
  }

  const totalStars = ownerRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const ownerInfo = {
    name: owner,
    totalRepositories: ownerRepos.length,
    totalStars,
  };

  return (
    <DateRangeProvider fullName={owner}>
      <div className="flex flex-col min-h-screen">
        <Navbar user={session.user} ownerInfo={ownerInfo} />
        <div className="container mx-auto p-4 sm:p-10 space-y-6">
          <Suspense fallback={<StarsChart isLoading />}>
            <OwnerStarsChartWrapper owner={owner} repos={ownerRepos} />
          </Suspense>
          <Suspense fallback={<ViewChart isLoading />}>
            <OwnerViewChartWrapper owner={owner} repos={ownerRepos} />
          </Suspense>
          <Suspense fallback={<CloneChart isLoading />}>
            <OwnerCloneChartWrapper owner={owner} repos={ownerRepos} />
          </Suspense>
          <Suspense fallback={<ReferrersChart isLoading />}>
            <OwnerReferrersChartWrapper owner={owner} repos={ownerRepos} />
          </Suspense>
          <Suspense fallback={<PopularContentChart isLoading />}>
            <OwnerPopularContentChartWrapper owner={owner} repos={ownerRepos} />
          </Suspense>
        </div>
      </div>
    </DateRangeProvider>
  );
}
