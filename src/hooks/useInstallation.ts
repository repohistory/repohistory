import useSWR from 'swr';
import fetcher from '@/utils';

export default function useInstallation() {
  const {
    data,
    error,
    isLoading,
  } = useSWR('https://api.github.com/user/installations', fetcher);

  if (error || data?.total_count === 0) {
    return  { installations: null, error: true }
  }

  if (isLoading) {
    return  { installations: null, error: null }
  }

  return  { installations: data.installations, error: null }
}
