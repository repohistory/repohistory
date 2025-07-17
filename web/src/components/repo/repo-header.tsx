import Link from "next/link";
import { ExportAllData } from "@/components/export-all-data";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface RepoInfo {
  id: number;
  full_name: string;
  description: string | null;
}

interface RepoHeaderProps {
  repoInfo: RepoInfo;
}

export function RepoHeader({ repoInfo }: RepoHeaderProps) {
  return (
    <div className="sticky flex items-center justify-between gap-2 top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4 sm:px-10">
      <h1 className="text-lg truncate sm:text-xl font-semibold sm:font-bold">
        <Link
          href={`https://github.com/${repoInfo.full_name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-1"
        >
          {repoInfo.full_name}
        </Link>
      </h1>
      <div className="flex items-center gap-2">
        <DateRangePicker />
        <div className="hidden md:block">
          <ExportAllData fullName={repoInfo.full_name} repoId={repoInfo.id} />
        </div>
      </div>
    </div>
  );
}
