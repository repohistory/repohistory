import { DashboardViews } from "@/components/repo/dashboard-views";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import { RepoGrid } from "@/components/repo/repo-grid";
import { OwnerGrid } from "@/components/repo/owner-grid";
import { getRepos } from "@/utils/octokit/get-repos";

export default async function DashboardContent() {
  const octokit = await getUserOctokit();
  const { repos, reposByOwner } = await getRepos(octokit);

  return (
    <DashboardViews
      repoView={<RepoGrid repos={repos} />}
      ownerView={<OwnerGrid reposByOwner={reposByOwner} />}
    />
  );
}
