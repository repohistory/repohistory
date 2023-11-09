import { Select, SelectItem } from '@nextui-org/react';
import { parseCookies, setCookie } from 'nookies';

export default function BranchSelector({ branches }: { branches: any[] }) {
  const cookies = parseCookies();
  const branch = cookies.repohistoryBranch ?? 'github-repo-stats';
  if (!branch) {
    setCookie(null, 'repohistoryBranch', 'github-repo-stats', {
      path: '/',
    });
  }

  return (
    <Select
      classNames={{
        base: 'w-64 text-white',
        trigger: 'bg-[#222222]',
      }}
      label="branch of your data repo"
      defaultSelectedKeys={[branch]}
      onChange={(e) => {
        setCookie(null, 'repohistoryBranch', e.target.value, {
          path: '/',
        });
      }}
    >
      {branches?.map((b: any) => (
        <SelectItem key={b.name} className="text-white">
          {b.name}
        </SelectItem>
      ))}
    </Select>
  );
}
