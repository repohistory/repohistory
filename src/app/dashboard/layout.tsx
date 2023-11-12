import { Navbar, Link } from '@nextui-org/react';
import DropdownWrapper from '@/components/DropdownWrapper';
import Image from 'next/image';
import Path from '@/components/Path';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar
        isBordered
        height="4.0rem"
        className="border-[#202225]"
        classNames={{
          base: 'justify-between',
          wrapper: 'max-w-full sm:px-10',
        }}
      >
        <Link href="/" className="hover:opacity-100">
          <Image
            width={30}
            height={30}
            alt="logo"
            src="/repohistory.png"
            unoptimized
          />
        </Link>
        <Path />
        <DropdownWrapper />
      </Navbar>
      <div className="w-full overflow-y-auto scrollbar-hide">{children}</div>
    </>
  );
}
