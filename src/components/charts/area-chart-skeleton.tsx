import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AreaChartSkeletonProps {
  type: "views" | "clones";
}

export function AreaChartSkeleton({ type }: AreaChartSkeletonProps) {
  const config = {
    views: {
      title: "Repository Views",
      description: "Daily views and unique visitors",
      totalLabel: "Total Views"
    },
    clones: {
      title: "Repository Clones",
      description: "Daily clones and unique cloners",
      totalLabel: "Total Clones"
    }
  };

  const { title, description, totalLabel } = config[type];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            {totalLabel}
          </span>
          <Skeleton className="h-6 w-16 sm:h-8 sm:w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <div className="h-8 flex justify-end items-center mb-4">
            {/* Space for zoom reset button */}
          </div>
          <div className="h-[calc(100%-2.5rem)] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}