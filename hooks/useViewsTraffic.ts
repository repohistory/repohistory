import useSWR from 'swr';
import fetcher from '@/utils';

export default function useViewsTraffic(owner: string, repo: string) {
  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${owner}/${repo}/traffic/views`,
    fetcher,
  );

  if (error || isLoading) {
    return null;
  }

  return data;
}
