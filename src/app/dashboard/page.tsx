'use client';

import useDataRepo from '@/hooks/useDataRepo';
import RepoCards from '@/components/RepoCards';
import Skeletons from '@/components/Skeletons';

export default function Dashboard() {
  const dataRepo = useDataRepo();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <div className="mx-auto grid w-3/4 gap-10 py-10 md:grid-cols-2 xl:grid-cols-3">
      {dataRepo === null ? <Skeletons /> : <RepoCards dataRepo={dataRepo} />}
    </div>
  );
}
