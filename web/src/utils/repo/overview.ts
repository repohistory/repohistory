import { Octokit } from "octokit";

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