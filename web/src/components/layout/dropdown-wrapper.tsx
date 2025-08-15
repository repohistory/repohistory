import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, MessageSquare, Bug, Lightbulb } from "lucide-react";
import { signout } from "@/actions/auth";

export async function DropdownWrapper() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session!.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/apps/repohistory/installations/new"
            rel="noopener noreferrer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Repositories
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MessageSquare className="stroke-muted-foreground mr-4 h-4 w-4" />
            Feedback
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem asChild>
                <Link
                  href="https://github.com/repohistory/repohistory/issues/new?type=bug"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Bug className="mr-2 h-4 w-4" />
                  Issue
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="https://github.com/repohistory/repohistory/issues/new?type=feature"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Idea
                </Link>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
