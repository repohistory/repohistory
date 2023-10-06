'use client';

import useLogout from '@/hooks/useLogout';
import useUser from '@/hooks/useUser';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Link,
} from '@nextui-org/react';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const user = useUser();
  const logout = useLogout();
  const pathname = usePathname();

  return (
    <Navbar isBordered className="bg-[#000000a0]">
      <NavbarBrand>
        <Link href="/" className="text-lg font-bold text-white">
          repohistory
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          {pathname !== '/login' ? (
            <Dropdown placement="bottom-end" className="bg-[#13131a] border border-[#333333]">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="border border-[#ffffff00] transition-transform"
                  src={user?.avatar_url}
                />
              </DropdownTrigger>
              <DropdownMenu
                className="text-white"
                aria-label="Profile Actions"
                variant="flat"
              >
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="font-semibold">@{user?.login}</p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={logout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : null}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
