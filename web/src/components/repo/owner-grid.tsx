import { Repo } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { OwnerCard } from "./owner-card";

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
            <OwnerCard key={ownerData.owner} ownerData={ownerData} />
          ))
        }
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
