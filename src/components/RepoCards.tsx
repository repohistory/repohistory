import useRepos from '@/hooks/useRepos';
import { parseCookies } from 'nookies';
import { Link } from '@nextui-org/react';
import RepoCard from './RepoCard';
import Skeletons from './Skeletons';

export default function RepoCards({ dataRepo }: { dataRepo: any }) {
  const cookies = parseCookies();
  const branch = cookies.repohistoryBranch ?? 'github-repo-stats';
  const { repos, error } = useRepos(dataRepo, branch);

  if (repos === null && error === null) {
    return <Skeletons />;
  }

  if (error) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white">
        Make sure you select the right branch for your data repo at{' '}
        <Link href="/dashboard/settings">settings page</Link>.
      </div>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {repos?.map((repo: any) => <RepoCard path={repo.path} key={repo.path} />)}
    </>
  );
}
