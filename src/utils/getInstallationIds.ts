import { cookies } from 'next/headers';
import { Octokit } from 'octokit';

export default async function getInstallationIds(): Promise<number[]> {
  const userOctokit = new Octokit({
    auth: cookies().get('access_token')?.value,
  });
  const { data: installationData } = await userOctokit.request(
    'GET /user/installations',
  );
  return installationData.installations.map(
    (installation: any) => installation.id,
  );
}
