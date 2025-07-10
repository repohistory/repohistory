import { Octokit } from "octokit";
import { unstable_cache } from "next/cache";

export async function getRepoInfo(
  octokit: Octokit,
  owner: string,
  repo: string
) {
  const getCachedRepo = unstable_cache(
    async (owner: string, repo: string) => {
      const { data } = await octokit.rest.repos.get({
        owner,
        repo,
      });
      return data;
    },
    [],
    {
      tags: ['repo-info'],
      revalidate: 86400, // 24 hours
    }
  );

  return getCachedRepo(owner, repo);
}