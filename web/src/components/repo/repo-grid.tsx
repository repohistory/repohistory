import { Repo } from "@/types";
import { RepoCard } from "./repo-card";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  repos: Repo[];
}

export function RepoGrid({ repos }: Props) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {repos
          .sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count)
          .map((repo: Repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        <Link href="https://github.com/apps/repohistory/installations/new" rel="noopener noreferrer">
          <Card className="h-52 w-full cursor-pointer transition-all duration-200 hover:bg-accent active:scale-99 border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center gap-2">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
