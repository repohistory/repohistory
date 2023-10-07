import useLogout from '@/hooks/useLogout';
import useUser from '@/hooks/useUser';
import {
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from '@nextui-org/react';

export default function DropdownWrapper() {
  const user = useUser();
  const logout = useLogout();

  return (
    <Dropdown
      placement="bottom-end"
      className="border border-[#333333] bg-[#13131a]"
    >
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
  );
}
