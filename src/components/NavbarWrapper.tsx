import { Navbar, NavbarBrand, Link } from '@nextui-org/react';
import Image from 'next/image';

export default function NavbarWrapper() {
  return (
    <Navbar isBordered height="4.0rem" className="bg-black">
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
    </Navbar>
  );
}
