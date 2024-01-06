/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import RepoCard from '@/components/RepoCard';
import Guide from '@/components/Guide';
import getRepos from '@/utils/getRepos';
import getInstallationIds from '@/utils/getInstallationIds';
import { getLimit } from '@/utils/getLimit';
import { Link } from '@nextui-org/react';

export default async function Dashboard() {
  const installationIds = await getInstallationIds();
  const repos = await getRepos(installationIds);
  const limit = await getLimit(installationIds[0]);
  const isValidInstallation = repos.length > 0 && repos.length <= limit;

  return (
    <div className="flex flex-col items-center pt-5">
      <Link
        isExternal
        href="https://www.producthunt.com/posts/repohistory?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-repohistory"
        className="font-semibold text-white underline"
      >
        🎉 Help us grow on Product Hunt 🎉
      </Link>
      <div className="flex w-full justify-center px-5 py-5 md:px-10 lg:px-20 ">
        {isValidInstallation ? (
          <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
            {repos
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .map((repo: any) => (
                <RepoCard repo={repo} key={repo.id} />
              ))}
          </div>
        ) : (
          <Guide repos={repos} limit={limit} />
        )}
      </div>
    </div>
  );
}
