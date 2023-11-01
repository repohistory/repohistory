import { Select, SelectItem } from '@nextui-org/react';

export default function BranchSelector({
  branches,
  setBranch,
}: {
  branches: any[];
  setBranch: any;
}) {
  return (
    <Select
      className="mx-auto block w-64 pt-32 text-white"
      label="branch of your data repo"
      onChange={(e) => setBranch(e.target.value)}
    >
      {branches?.map((b: any) => (
        <SelectItem key={b.name} className="text-white">
          {b.name}
        </SelectItem>
      ))}
    </Select>
  );
}
