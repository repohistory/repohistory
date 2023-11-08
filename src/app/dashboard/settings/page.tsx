'use client';

import BranchSelector from '@/components/BranchSelector';
import useBranches from '@/hooks/useBranches';
import useDataRepo from '@/hooks/useDataRepo';

export default function SettingsPage() {
  const { dataRepo }: { dataRepo: any } = useDataRepo();
  const branches = useBranches(dataRepo ?? []);

  return (
    <div className="mx-64 mt-20 flex flex-col gap-5">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      {branches?.length ? <BranchSelector branches={branches} /> : null}
    </div>
  );
}
