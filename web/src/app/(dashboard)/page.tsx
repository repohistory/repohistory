import { Suspense } from "react";
import { DashboardViewSwitcher } from "@/components/repo/dashboard-view-switcher";
import { RepoGrid } from "@/components/repo/repo-grid";
import { OwnerGrid } from "@/components/repo/owner-grid";
import { RepoCardSkeletonGrid } from "@/components/repo/repo-card-skeleton";
import { getRepos } from "@/utils/octokit/get-repos";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import { SetupActionToast } from "@/components/setup-action-toast";

export default async function Home() {
  const octokit = await getUserOctokit();
  const { repos, reposByOwner, shouldShowOwnerView } = await getRepos(octokit);

  const repoView = (
    <Suspense fallback={<RepoCardSkeletonGrid />}>
      <RepoGrid repos={repos} />
    </Suspense>
  );

  const ownerView = (
    <Suspense fallback={<RepoCardSkeletonGrid />}>
      <OwnerGrid reposByOwner={reposByOwner} />
    </Suspense>
  );

  return (
    <>
      <Suspense>
        <SetupActionToast />
      </Suspense>
      <DashboardViewSwitcher
        shouldShowOwnerView={shouldShowOwnerView}
        repoView={repoView}
        ownerView={ownerView}
      />
    </>
  );
}
