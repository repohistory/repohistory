'use client';

import useDataRepo from '@/hooks/useDataRepo';
import RepoCards from '@/components/RepoCards';
import Skeletons from '@/components/Skeletons';
import GetStarted from '@/components/GetStarted';

export default function Dashboard() {
  const { dataRepo, error } = useDataRepo();

  if (error) {
    return <GetStarted />;
  }

  return (
    <div className="mx-auto grid w-3/4 gap-10 py-10 md:grid-cols-2 xl:grid-cols-3">
      {dataRepo === null ? <Skeletons /> : <RepoCards dataRepo={dataRepo} />}
    </div>
  );
}
