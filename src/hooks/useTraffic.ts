import useSWR from 'swr';
import fetcher from '@/utils';

export default function useTraffic(owner: string, repo: string) {
  const dataRepo = 'github-status';
  const branch = 'github-repo-stats';
  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${owner}/${dataRepo}/contents/${owner}/${repo}/ghrs-data/views_clones_aggregate.csv?ref=${branch}`,
    fetcher,
  );

  if (error || isLoading) {
    return null;
  }

  return data;
}
