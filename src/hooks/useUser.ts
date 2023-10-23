import useSWR from 'swr';
import fetcher from '@/utils';

export default function useUser() {
  const { data, error, isLoading } = useSWR(
    'https://api.github.com/user',
    fetcher,
  );

  if (error || isLoading) {
    return null;
  }

  return data;
}
