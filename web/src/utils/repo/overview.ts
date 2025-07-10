import { Octokit } from "octokit";

export interface RepoOverviewData {
  name: string;
  fullName: string;
  repoId: number;
  description: string | null;
  stars: number;
  forks: number;
  issues: number;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

export async function getRepoOverview(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<RepoOverviewData> {
  const { data } = await octokit.rest.repos.get({
    owner,
    repo,
  });

  return {
    name: data.name,
    fullName: data.full_name,
    repoId: data.id,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    issues: data.open_issues_count,
    language: data.language,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    htmlUrl: data.html_url,
  };
}

export async function getTopReferrers(
  octokit: Octokit,
  fullName: string
): Promise<Array<{ referrer: string; count: number; uniques: number }>> {
  try {
    const [owner, repo] = fullName.split("/");
    const { data } = await octokit.rest.repos.getTopReferrers({ owner, repo });
    return data || [];
  } catch (error) {
    console.error("Error fetching referrers data:", error);
    return [];
  }
}

export async function getTopPaths(
  octokit: Octokit,
  fullName: string
): Promise<Array<{ path: string; title: string; count: number; uniques: number }>> {
  try {
    const [owner, repo] = fullName.split("/");
    const { data } = await octokit.rest.repos.getTopPaths({ owner, repo });
    return data || [];
  } catch (error) {
    console.error("Error fetching paths data:", error);
    return [];
  }
}