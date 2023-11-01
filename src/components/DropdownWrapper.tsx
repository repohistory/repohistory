import useLogout from '@/hooks/useLogout';
import useUser from '@/hooks/useUser';
import {
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from '@nextui-org/react';
import Link from 'next/link';

export default function DropdownWrapper() {
  const user = useUser();
  const logout = useLogout();

  return (
    <Dropdown
      placement="bottom-end"
      className="border border-[#202225] bg-[#121212]"
    >
      <DropdownTrigger>
        <Avatar
          as="button"
          className="border border-[#202225] transition-transform"
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
        <DropdownItem key="settings" href="/dashboard/settings" as={Link}>
          Settings
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={logout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
