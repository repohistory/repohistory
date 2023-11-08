import useSWR from 'swr';
import fetcher from '@/utils';
import useUser from './useUser';

export default function useInstallation() {
  const { data, error, isLoading } = useSWR(
    'https://api.github.com/user/installations',
    fetcher,
  );
  const user = useUser();

  if (error || data?.total_count === 0) {
    return { installation: null, error: true };
  }

  if (isLoading) {
    return { installation: null, error: null };
  }

  const installation = data.installations.find(
    (i: any) => i.account.login === user.login,
  );

  return { installation, error: null };
}
