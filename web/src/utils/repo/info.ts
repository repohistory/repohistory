import { Octokit } from "octokit";

export async function getRepoInfo(
  octokit: Octokit,
  owner: string,
  repo: string
) {
  const { data } = await octokit.rest.repos.get({
    owner,
    repo,
  });
  return data;
}
