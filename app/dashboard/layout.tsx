'use client';

import DropdownWrapper from '@/components/DropdownWrapper';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div
        className="flex w-20 flex-col items-center justify-between shrink-0
          border-r border-r-[#202225] bg-[#121212] py-5 text-white"
      >
        <Link href="/dashboard">
          <Image width={35} height={35} alt="logo" src="/repohistory.png" />
        </Link>
        <DropdownWrapper />
      </div>
      <div className="w-full overflow-y-auto scrollbar-hide">{children}</div>
    </div>
  );
}
