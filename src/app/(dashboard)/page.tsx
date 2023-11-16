/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import RepoCard from '@/components/RepoCard';
import { Link } from '@nextui-org/react';

import { fetchInstallationIds } from '@/utils/dbHelpers';
import { cookies } from 'next/headers';
import { app } from '@/utils/octokit';
import supabase from '@/utils/supabase';

export default async function Dashboard() {
  const repos: any[] = [];
  try {
    const userId = cookies().get('user_id')?.value ?? '';
    const installationIds = await fetchInstallationIds(userId);
    for (const installationId of installationIds) {
      await app.eachRepository({ installationId }, ({ repository }) => {
        repos.push(repository);
      });
    }
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch (error) {
    console.log(error);
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('github_user_id', cookies().get('user_id')?.value ?? '');

  const limit = error ? 2 : data[0].repository_limit ?? 2;

  let content;
  if (repos.length === 0 || repos.length > limit) {
    content = (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-center text-2xl font-bold text-white">
          {repos.length === 0 ? 'No' : `More than ${limit}`} repositories
          selected
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Please{' '}
          <Link
            underline="always"
            isExternal
            className="text-sm"
            href="https://github.com/apps/repohistory/installations/new"
          >
            {repos.length === 0 ? 'install' : 'configure'} GitHub App
          </Link>{' '}
          and select at most {limit} repositories you want to track.
        </p>
      </div>
    );
  } else {
    content = (
      <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
        {repos.map((repo: any) => (
          <RepoCard repo={repo} key={repo.id} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center px-5 py-5 sm:py-10 md:px-10 lg:px-20 ">
      {content}
    </div>
  );
}
