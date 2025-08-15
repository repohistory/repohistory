import { Suspense } from "react";
import { RepoCardSkeletonGrid } from "@/components/repo/repo-card-skeleton";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import { SetupActionToast } from "@/components/setup-action-toast";
import { DashboardViewSwitcher } from "@/components/repo/dashboard-view-switcher";
import DashboardContent from "@/components/dashboard-content";

export default async function Home() {
  const octokit = await getUserOctokit();

  return (
    <>
      <DashboardViewSwitcher />
      <Suspense fallback={<RepoCardSkeletonGrid />}>
        <DashboardContent octokit={octokit} />
      </Suspense>
      <Suspense>
        <SetupActionToast />
      </Suspense>
    </>
  );
}
