/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import RepoCard from '@/components/RepoCard';
import { Image, Link } from '@nextui-org/react';

import { cookies } from 'next/headers';
import { app } from '@/utils/octokit';
import supabase from '@/utils/supabase';
import { Octokit } from 'octokit';

export default async function Dashboard() {
  const repos: any[] = [];
  try {
    const userOctokit = new Octokit({
      auth: cookies().get('access_token')?.value ?? '',
    });
    const { data: installationData } = await userOctokit.request(
      'GET /user/installations',
    );
    const installationIds = installationData.installations.map(
      (installation: any) => installation.id,
    );

    for (const installationId of installationIds) {
      await app.eachRepository({ installationId }, ({ repository }) => {
        repos.push(repository);
      });
    }
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch (error) {
    console.log(error);
  }

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('github_user_id', cookies().get('user_id')?.value ?? '');

  let limit = 2;
  if (data && data.length > 0) {
    limit = data[0].repository_limit;
  }

  let content;
  if (repos.length === 0 || repos.length > limit) {
    content = (
      <div className="flex w-full flex-col items-center justify-center gap-5 text-white md:flex-row md:items-start">
        <div className="flex flex-col justify-start gap-3">
          <h1 className="text-2xl font-bold">
            {repos.length === 0
              ? 'No repositories selected'
              : `More than ${limit} repositories selected`}
          </h1>
          <div className="mt-2">
            Visit{' '}
            <Link
              underline="always"
              isExternal
              className="text-sm"
              href="https://github.com/apps/repohistory/installations/new"
            >
              GitHub App page
            </Link>{' '}
            and follow the instructions.
          </div>
          <div className="flex gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
              1
            </div>
            <span>
              Check <b>Only select repositories</b>
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
              2
            </div>
            <span>
              Select <b>at most {limit}</b> repositories you want to track
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
              3
            </div>
            <span>
              Click {repos.length === 0 ? 'Install' : 'Save'} and refresh this
              page
            </span>
          </div>
        </div>
        <Image
          src="https://github.com/m4xshen/img-host/assets/74842863/8156efbd-7be0-4432-8f26-8489e0abd782"
          alt="GitHub App installation instruction"
          width={350}
          radius="md"
          className="flex-shrink-0"
        />
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
