import Link from "next/link";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="size-9">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link target="_blank" href={`/star-history?owner=${repoInfo.full_name.split('/')[0]}&repo=${repoInfo.full_name.split('/')[1]}`}>
                  Generate star history chart
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`/api/export/${repoInfo.id}?format=csv&repo=${encodeURIComponent(repoInfo.full_name)}`}
                  download={`${repoInfo.full_name.replace('/', '-')}-data.zip`}
                >
                  Export all data
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
