import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bug, Lightbulb } from "lucide-react";
import { DropdownWrapper } from "./dropdown-wrapper";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/60 backdrop-blur-md backdrop-filter">
      <div className="flex h-full items-center justify-between px-4 sm:px-10">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            width={28}
            height={28}
            alt="logo"
            src="/icons/transparent.png"
            unoptimized
          />
        </Link>
        <div className="flex items-center gap-5">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                Feedback
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                <div className="font-medium text-sm">What would you like to share?</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button size="sm" variant="outline" asChild className="py-10">
                    <Link
                      href="https://github.com/repohistory/repohistory/issues/new?type=bug"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Bug className="h-4 w-4" />
                      Issue
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="py-10">
                    <Link
                      href="https://github.com/repohistory/repohistory/issues/new?type=feature"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Idea
                    </Link>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownWrapper user={user} />
        </div>
      </div>
    </nav>
  );
}
