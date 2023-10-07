'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@nextui-org/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import DropdownWrapper from './DropdownWrapper';

export default function NavbarWrapper() {
  const pathname = usePathname();

  return (
    <Navbar isBordered height="4.5rem" className="bg-[#000000a0]">
      <NavbarBrand>
        <Link
          href="/"
          className="text-lg font-bold text-white hover:opacity-100"
        >
          <Image
            width={25}
            height={25}
            alt="logo"
            src="/repohistory.png"
            unoptimized
          />
          <h1 className="ml-2">repohistory</h1>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          {pathname === '/dashboard' ? <DropdownWrapper /> : null}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
