import fetcher from '@/utils';
import useSWR from 'swr';

export default function useRepos() {
  const owner = 'm4xshen';
  const dataRepo = 'github-status';
  const branch = 'github-repo-stats';
  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${owner}/${dataRepo}/git/trees/${branch}?recursive=1`,
    fetcher,
  );

  if (error || isLoading) {
    return null;
  }

  return data.tree.filter((d: any) => /^[^/]+\/[^/]+$/.test(d.path));
}
