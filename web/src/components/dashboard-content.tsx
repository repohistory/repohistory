import { Octokit } from "octokit";
import { DashboardViews } from "@/components/repo/dashboard-views";
import { RepoGrid } from "@/components/repo/repo-grid";
import { OwnerGrid } from "@/components/repo/owner-grid";
import { getRepos } from "@/utils/octokit/get-repos";

interface DashboardContentProps {
  octokit: Octokit;
}

export default async function DashboardContent({ octokit }: DashboardContentProps) {
  const { repos, reposByOwner } = await getRepos(octokit);

  return (
    <DashboardViews
      repoView={<RepoGrid repos={repos} />}
      ownerView={<OwnerGrid reposByOwner={reposByOwner} />}
    />
  );
}
