import { Octokit } from "octokit";
import { getRepos } from "@/utils/octokit/get-repos";
import { Repo } from "@/types";
import { RepoCard } from "@/components/repo-card";
import { getValidProviderToken } from "@/utils/auth/refresh-token";

export async function RepoList() {
  const providerToken = await getValidProviderToken();

  const octokit = new Octokit({
    auth: providerToken
  });

  const repos = await getRepos(octokit);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .map((repo: Repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
      </div>
    </div>
  );
}
