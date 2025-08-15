import Link from "next/link";
import Image from "next/image";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { DropdownWrapper } from "./dropdown-wrapper";
import { Suspense } from "react";

interface RepoInfo {
  id: number;
  full_name: string;
  description: string | null;
}

interface OwnerInfo {
  name: string;
  totalRepositories: number;
  totalStars: number;
}

interface NavbarProps {
  repoInfo?: RepoInfo;
  ownerInfo?: OwnerInfo;
}

export function Navbar({ repoInfo, ownerInfo }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-border bg-background/60 backdrop-blur-md backdrop-filter flex items-center justify-between px-4 sm:px-10">
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            width={28}
            height={28}
            alt="logo"
            src="/icons/transparent.png"
            quality={100}
          />
        </Link>
        {repoInfo && (
          <h1 className="text-md truncate max-w-xs font-semibold sm:font-bold hidden sm:block">
            <Link
              href={`https://github.com/${repoInfo.full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline decoration-1"
            >
              {repoInfo.full_name}
            </Link>
          </h1>
        )}
        {ownerInfo && (
          <h1 className="text-md truncate max-w-xs font-semibold sm:font-bold hidden sm:block">
            <Link
              href={`https://github.com/${ownerInfo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline decoration-1"
            >
              {ownerInfo.name}
            </Link>
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        {(repoInfo || ownerInfo) && <DateRangePicker />}
        {repoInfo && (
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
        )}
        <Suspense>
          <DropdownWrapper />
        </Suspense>
      </div>
    </nav>
  );
}
