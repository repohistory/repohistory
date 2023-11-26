import { Octokit } from 'octokit';
import { cookies } from 'next/headers';

export default async function getInstallationIds(): Promise<number[]> {
  const auth = cookies().get('access_token')?.value;
  if (!auth) {
    return [];
  }

  const userOctokit = new Octokit({ auth });
  const { data: installationData } = await userOctokit.request(
    'GET /user/installations',
  );
  return installationData.installations.map(
    (installation: any) => installation.id,
  );
}
