import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, BookMarked } from "lucide-react";
import { Repo } from "@/types";
import { Suspense } from "react";
import { OwnerCardContent } from "./owner-card-content";
import { RepoCardContentSkeleton } from "./repo-card-skeleton";

interface OwnerData {
  owner: string;
  repos: Repo[];
  totalStars: number;
}

export function OwnerCard({ ownerData }: {
  ownerData: OwnerData;
}) {
  return (
    <Link href={`/${ownerData.owner}`}>
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
  );
}