import useSWR from 'swr';
import fetcher from '@/utils';

export default function useClonesTraffic(owner: string, repo: string) {
  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${owner}/${repo}/traffic/clones`,
    fetcher,
  );

  if (error || isLoading) {
    return null;
  }

  return data;
}
