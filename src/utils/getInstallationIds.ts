import { getUserOctokit } from './octokit';

export default async function getInstallationIds(): Promise<number[]> {
  const userOctokit = await getUserOctokit();
  const { data: installationData } = await userOctokit.request(
    'GET /user/installations',
  );
  return installationData.installations.map(
    (installation: any) => installation.id,
  );
}
