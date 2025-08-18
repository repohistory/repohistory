import { Suspense } from "react";
import { RepoCardSkeletonGrid } from "@/components/repo/repo-card-skeleton";
import { SetupActionToast } from "@/components/setup-action-toast";
import { DashboardHeader } from "@/components/repo/dashboard-header";
import DashboardContent from "@/components/dashboard-content";

export default async function Home() {
  return (
    <div className="container flex flex-col gap-4 mx-auto p-4 pt-6">
      <Suspense>
        <DashboardHeader />
      </Suspense>
      <Suspense fallback={<RepoCardSkeletonGrid />}>
        <DashboardContent />
      </Suspense>
      <Suspense>
        <SetupActionToast />
      </Suspense>
    </div>
  );
}
