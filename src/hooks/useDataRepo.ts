import { useEffect, useState } from 'react';
import fetcher from '@/utils';
import useInstallation from './useInstallation';

export default function useDataRepo() {
  const { installations, error } = useInstallation();
  const [dataRepo, setDataRepo] = useState(null);

  useEffect(() => {
    if (!installations || !installations[0]) {
      return;
    }

    (async () => {
      const data = await fetcher(
        `https://api.github.com/user/installations/${installations[0].id}/repositories`,
      );
      setDataRepo(data.repositories[0]);
    })();
  }, [installations]);

  if (error) {
    return { dataRepo: null, error: true };
  }

  return { dataRepo, error: null };
}
