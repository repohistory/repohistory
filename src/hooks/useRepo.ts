import fetcher from '@/utils';
import useSWR from 'swr';

export default function useRepo(path: string) {
  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${path}`,
    fetcher,
  );

  if (error || isLoading) {
    return null;
  }

  return data;
}
