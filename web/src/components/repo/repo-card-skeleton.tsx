import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RepoCardSkeleton() {
  return (
    <Card className="h-52 gap-2 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-7 w-48" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <RepoCardContentSkeleton />
      </CardContent>
    </Card>
  );
}

export function RepoCardContentSkeleton() {
  return (
    <>
      <Skeleton className="h-24 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
      <div className="opacity-0">
        Some extra content with opacity 0 to make size over 1kb
      </div>
    </>
  );
}

export function RepoCardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <RepoCardSkeleton key={i} />
      ))}
    </div>
  );
}
