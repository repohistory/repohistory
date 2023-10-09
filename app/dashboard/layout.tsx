'use client';

import { Navbar, Link, NavbarContent } from '@nextui-org/react';
import DropdownWrapper from '@/components/DropdownWrapper';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  const pathname = usePathname();
  const parts = pathname.split('/');
  if (owner === '' && parts.length === 4 && parts[1] === 'dashboard') {
    setOwner(parts[2]);
    setRepo(parts[3]);
  }

  return (
    <>
      <Navbar
        isBordered
        height="4.5rem"
        className="border-[#202225] bg-[#121212]"
        classNames={{
          base: 'justify-between',
          wrapper: `max-w-full ${
            owner.length !== 0 && repo.length !== 0 ? 'sm:px-10' : 'px-10'
          }`,
        }}
      >
        <Link href="/" className="hover:opacity-100">
          <Image
            width={35}
            height={35}
            alt="logo"
            src="/repohistory.png"
            unoptimized
          />
        </Link>
        {owner.length !== 0 && repo.length !== 0 ? (
          <NavbarContent justify="start" className="gap-0 text-white">
            <Link
              isExternal
              isBlock
              size="md"
              color="foreground"
              href={`https://github.com/${owner}`}
              className="font-semibold"
            >
              {owner}
            </Link>
            <span className="text-lg font-semibold text-stone-400">/</span>
            <Link
              isExternal
              isBlock
              size="md"
              color="foreground"
              href={`https://github.com/${owner}/${repo}`}
              className="font-semibold"
            >
              {repo}
            </Link>
          </NavbarContent>
        ) : null}
        <DropdownWrapper />
      </Navbar>
      <div className="w-full overflow-y-auto scrollbar-hide">{children}</div>
    </>
  );
}
