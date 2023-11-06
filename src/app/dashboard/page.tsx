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
    <div className="flex w-full justify-center px-5 py-5 sm:py-10 md:px-10 lg:px-20 ">
      <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
        {dataRepo === null ? <Skeletons /> : <RepoCards dataRepo={dataRepo} />}
      </div>
    </div>
  );
}
