import useSWR from 'swr';
import fetcher from '@/utils';

export default function useInstallation() {
  const {
    data,
    error,
    isLoading,
  } = useSWR('https://api.github.com/user/installations', fetcher);

  if (error || isLoading) {
    return [];
  }

  return (data.installations)
}
