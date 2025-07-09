import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReleaseChartSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-col justify-center gap-1">
          <CardTitle>Release Downloads</CardTitle>
          <CardDescription>
            Download count for all releases
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            Total Downloads
          </span>
          <Skeleton className="h-6 w-16 sm:h-8 sm:w-20" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-64 w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
