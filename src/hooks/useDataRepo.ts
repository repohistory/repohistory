import { useEffect, useState } from 'react';
import fetcher from '@/utils';
import useInstallation from './useInstallation';

export default function useDataRepo() {
  const installations = useInstallation();
  const [dataRepo, setDataRepo] = useState(null);

  useEffect(() => {
    if (!installations[0]) {
      return;
    }

    (async () => {
      const data = await fetcher(
        `https://api.github.com/user/installations/${installations[0].id}/repositories`,
      );
      setDataRepo(data.repositories[0]);
    })();
  }, [installations]);

  if (installations.length === 0) {
    return { dataRepo: null, error: true };
  }

  return { dataRepo, error: null };
}
