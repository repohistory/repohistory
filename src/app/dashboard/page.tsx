import RepoCard from '@/components/RepoCard';
import { fetchInstallationId } from '@/utils/dbHelpers';
import { Link } from '@nextui-org/react';
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

  const repos = [];
  try {
    const octokit = await app.getInstallationOctokit(installationId);
    const response = await octokit.request('GET /installation/repositories');
    repos.push(...response.data.repositories);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex w-full justify-center px-5 py-5 sm:py-10 md:px-10 lg:px-20 ">
      {repos.length === 0 ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-center text-2xl font-bold text-white">
            No repositories found
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            Please <Link
              className="text-sm"
              href="https://github.com/apps/repohistory/installations/new"
              target="_blank"
            >
              install GitHub App
            </Link> and add repositories to your installation
          </p>
        </div>
      ) : (
        <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
          {repos.map((repo: any) => (
            <RepoCard repo={repo} key={repo.id} />
          ))}
        </div>
      )}
    </div>
  );
}
