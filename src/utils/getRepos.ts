/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { app } from './octokit';

export default async function getRepos(installationIds: number[]) {
  const repos: any[] = [];

  for (const installationId of installationIds) {
    await app.eachRepository({ installationId }, ({ repository }) => {
      repos.push(repository);
    });
  }

  return repos;
}
