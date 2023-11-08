import { useEffect, useState } from 'react';
import fetcher from '@/utils';
import useInstallation from './useInstallation';

export default function useDataRepo() {
  const { installation, error } = useInstallation();
  const [dataRepo, setDataRepo] = useState(null);

  useEffect(() => {
    if (!installation) {
      return;
    }

    (async () => {
      const data = await fetcher(
        `https://api.github.com/user/installations/${installation.id}/repositories`,
      );
      setDataRepo(data.repositories[0].full_name);
    })();
  }, [installation]);

  if (error) {
    return { dataRepo: null, error: true };
  }

  return { dataRepo, error: null };
}
