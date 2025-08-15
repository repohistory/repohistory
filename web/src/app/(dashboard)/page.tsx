import { Suspense } from "react";
import { RepoCardSkeletonGrid } from "@/components/repo/repo-card-skeleton";
import { SetupActionToast } from "@/components/setup-action-toast";
import { DashboardViewSwitcher } from "@/components/repo/dashboard-view-switcher";
import DashboardContent from "@/components/dashboard-content";

export default async function Home() {
  return (
    <>
      <Suspense>
        <DashboardViewSwitcher />
      </Suspense>
      <Suspense fallback={<RepoCardSkeletonGrid />}>
        <DashboardContent />
      </Suspense>
      <Suspense>
        <SetupActionToast />
      </Suspense>
    </>
  );
}
