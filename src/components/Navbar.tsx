import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { DropdownWrapper } from "./DropdownWrapper";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="h-16 border-b border-border bg-background/80 backdrop-blur-md backdrop-filter">
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
        <DropdownWrapper user={user} />
      </div>
    </nav>
  );
}
