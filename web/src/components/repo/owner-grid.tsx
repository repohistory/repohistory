import { Repo } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Plus, BookMarked } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { OwnerCardContent } from "./owner-card-content";
import { RepoCardContentSkeleton } from "./repo-card-skeleton";

interface OwnerData {
  owner: string;
  repos: Repo[];
  totalStars: number;
}

interface Props {
  reposByOwner: Record<string, Repo[]>;
}

export function OwnerGrid({ reposByOwner }: Props) {
  const ownerData = Object.entries(reposByOwner).map(([owner, repos]) => ({
    owner,
    repos,
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {ownerData
          .sort((a, b) => b.totalStars - a.totalStars)
          .map((ownerData: OwnerData) => (
            <Link key={ownerData.owner} href={`/${ownerData.owner}`}>
              <Card className="h-56 w-full cursor-pointer transition-all duration-200 hover:bg-accent active:scale-98">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg font-semibold truncate">{ownerData.owner}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookMarked className="h-4 w-4" />
                      {ownerData.repos.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {ownerData.totalStars}
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col gap-2">
                  <Suspense fallback={<RepoCardContentSkeleton />}>
                    <OwnerCardContent repos={ownerData.repos} />
                  </Suspense>
                </CardContent>
              </Card>
            </Link>
          ))
        }
        <Link href="https://github.com/apps/repohistory/installations/new" rel="noopener noreferrer">
          <Card className="h-56 w-full cursor-pointer transition-all duration-200 hover:bg-accent active:scale-98 border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center gap-2">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
