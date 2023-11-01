import fetcher from '@/utils';
import useSWR from 'swr';

export default function useRepos(dataRepo: any, branch: string) {
  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${dataRepo.full_name}/git/trees/${branch}?recursive=true`,
    fetcher,
  );

  if (data?.message) {
    return { repos: null, error: new Error(data.message) };
  }

  if (error) {
    return { repos: null, error };
  }

  if (isLoading) {
    return { repos: null, error: null };
  }

  return {
    repos: data.tree.filter((d: any) => /^[^/]+\/[^/]+$/.test(d.path)),
    error: null,
  };
}
