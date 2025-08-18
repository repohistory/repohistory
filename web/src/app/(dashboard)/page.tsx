import { Suspense } from "react";
import { RepoCardSkeletonGrid } from "@/components/repo/repo-card-skeleton";
import { SetupActionToast } from "@/components/setup-action-toast";
import { DashboardHeader } from "@/components/repo/dashboard-header";
import DashboardContent from "@/components/dashboard-content";

export default async function Home() {
  return (
    <>
      <Suspense>
        <DashboardHeader />
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
