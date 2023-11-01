'use client';

import useDataRepo from '@/hooks/useDataRepo';
import RepoCards from '@/components/RepoCards';
import Skeletons from '@/components/Skeletons';
import { Link } from '@nextui-org/react';

export default function Dashboard() {
  const { dataRepo, error } = useDataRepo();

  if (error) {
    return (
      <div className="mt-32 flex flex-col items-center text-white">
        <div>
          <h1 className="text-lg font-bold">Get started with 3 steps</h1>
          <ol className="ml-5 list-decimal">
            <li>
              Setup <Link
                href="https://github.com/marketplace/actions/github-repo-stats"
                target="_blank"
              >
                github-repo-stats action
              </Link>
            </li>
            <li>
              Install <Link
                href="https://github.com/apps/repohistory/installations/new"
                target="_blank"
              >
                repohistory GitHub App
              </Link>
            </li>
            <li>
              Select &quot;Only select repositories&quot; and choose your data
              repository
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-3/4 gap-10 py-10 md:grid-cols-2 xl:grid-cols-3">
      {dataRepo === null ? <Skeletons /> : <RepoCards dataRepo={dataRepo} />}
    </div>
  );
}
