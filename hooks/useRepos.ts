import fetcher from '@/utils';
import { useEffect, useState } from 'react';
import useInstallation from './useInstallation';

export default function useRepos() {
  const installations = useInstallation();
  const [repos, setRepos] = useState<[] | null>(null);

  useEffect(() => {
    (async () => {
      if (!installations[0]) {
        return;
      }

      const data = await fetcher(
        `https://api.github.com/user/installations/${installations[0].id}/repositories`,
      );
      setRepos(data.repositories);
    })();
  }, [installations]);

  if (repos === null) {
    return null;
  }

  const sortedData = repos.sort(
    (a: any, b: any) => b.stargazers_count - a.stargazers_count,
  );

  return sortedData;
}
