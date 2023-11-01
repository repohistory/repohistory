import fetcher from '@/utils';
import useSWR from 'swr';

function isDataRepo(data: any) {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data.tree) {
    const pathParts = item.path.split('/');

    if (pathParts.length >= 4 && pathParts[2] === 'ghrs-data') {
      return true;
    }
  }

  return false;
}

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

  if (!isDataRepo(data)) {
    return {
      repos: null,
      error: true,
    };
  }

  return {
    repos: data.tree.filter((d: any) => /^[^/]+\/[^/]+$/.test(d.path)),
    error: null,
  };
}
