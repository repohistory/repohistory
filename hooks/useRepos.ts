import useSWR from 'swr';
import fetcher from '@/utils';

export default function useRepos() {
  const {
    data: repos,
    error,
    isLoading,
  } = useSWR('https://api.github.com/user/repos', fetcher);

  if (error || isLoading) {
    return [];
  }

  const sortedData = repos
    .filter((repo: any) => repo.stargazers_count > 1)
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);

  return sortedData;
}
