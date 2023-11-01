import useRepos from '@/hooks/useRepos';
// import { useState } from 'react';
// import useBranches from '@/hooks/useBranches';
import RepoCard from './RepoCard';
import Skeletons from './Skeletons';
// import BranchSelector from './BranchSelector';

export default function RepoCards({ dataRepo }: { dataRepo: any }) {
  // const [branch, setBranch] = useState('github-repo-stats');
  // const branches = useBranches(dataRepo.full_name);
  const branch = 'github-repo-stats';
  const { repos, error } = useRepos(dataRepo, branch);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!error ? (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {repos?.map((repo: any) => (
            <RepoCard path={repo.path} key={repo.path} />
          ))}
        </>
      ) : (
        <Skeletons />
      )}
    </>
  );
}
