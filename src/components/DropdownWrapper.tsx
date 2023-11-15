'use client';

import useLogout from '@/hooks/useLogout';
import {
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DropdownWrapper({ user }: { user: any }) {
  const router = useRouter();
  const logout = useLogout(router);

  return (
    <Dropdown
      placement="bottom-end"
      className="border border-[#202021] bg-[#111112]"
    >
      <DropdownTrigger>
        <Avatar
          as="button"
          className="border border-[#202021] transition-transform"
          src={user?.avatar_url}
        />
      </DropdownTrigger>
      <DropdownMenu
        className="text-white"
        aria-label="Profile Actions"
        variant="light"
      >
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">{user?.name}</p>
          <p className="font-semibold">@{user?.login}</p>
        </DropdownItem>
        <DropdownItem key="settings" color="primary" href="/settings" as={Link}>
          Settings
        </DropdownItem>
        <DropdownItem key="logout" color="primary" onClick={logout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
