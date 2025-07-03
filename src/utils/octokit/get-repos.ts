import { Repo } from "@/types";
import { Octokit, App } from "octokit";

const app = new App({
  appId: process.env.APP_ID!,
  privateKey: process.env.APP_PRIVATE_KEY!,
});

export async function getRepos(octokit: Octokit) {

  const { data: installationData } = await octokit.request(
    'GET /user/installations',
  );

  const installationIds = installationData.installations
    .filter(installation => installation.suspended_at === null)
    .map(
      (installation) => installation.id,
    );

  const repos: Repo[] = [];

  for (const installationId of installationIds) {
    await app.eachRepository({ installationId }, ({ repository }) => {
      repos.push(repository);
    });
  }

  return repos;
}
