import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { Repo } from "@/types";

export function RepoCard({ repo }: {
  repo: Repo;
}) {
  return (
    <Link href={`/${repo.full_name}`}>
      <Card className="h-56 w-full cursor-pointer transition-colors hover:bg-accent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">{repo.full_name}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            {repo.stargazers_count}
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {repo.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
