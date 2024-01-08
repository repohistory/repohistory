/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import RepoCard from '@/components/RepoCard';
import Guide from '@/components/Guide';
import getRepos from '@/utils/getRepos';
import getInstallationIds from '@/utils/getInstallationIds';
import { getLimit } from '@/utils/getLimit';

export default async function Dashboard() {
  const installationIds = await getInstallationIds();
  const repos = await getRepos(installationIds);
  const limit = await getLimit(installationIds[0]);
  const isValidInstallation = repos.length > 0 && repos.length <= limit;

  return (
    <div className="flex w-full justify-center px-5 py-5 sm:py-10 md:px-10 lg:px-20 ">
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
  );
}
