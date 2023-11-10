import RepoCard from '@/components/RepoCard';
import { fetchInstallationId } from '@/utils/dbHelpers';
import { cookies } from 'next/headers';
import { App } from 'octokit';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

export default async function Dashboard() {
  const userId = cookies().get('user_id')?.value ?? '';
  const installationId = await fetchInstallationId(userId);

  const octokit = await app.getInstallationOctokit(installationId);
  const response = await octokit.request('GET /installation/repositories');
  const { repositories: repos } = response.data;

  return (
    <div className="flex w-full justify-center px-5 py-5 sm:py-10 md:px-10 lg:px-20 ">
      <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
        {repos.map((repo: any) => (
          <RepoCard repo={repo} key={repo.id} />
        ))}
      </div>
    </div>
  );
}
