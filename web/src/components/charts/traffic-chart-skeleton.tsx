import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TrafficChartSkeletonProps {
  type: "referrers" | "popular-content";
}

export function TrafficChartSkeleton({ type }: TrafficChartSkeletonProps) {
  const config = {
    referrers: {
      title: "Referring Sites",
      description: "Sources driving traffic to your repository over time"
    },
    "popular-content": {
      title: "Popular Content", 
      description: "Most visited pages in your repository over time"
    }
  };

  const { title, description } = config[type];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
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