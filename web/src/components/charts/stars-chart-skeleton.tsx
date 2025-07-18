import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface StarsChartSkeletonProps {
  hasShareButton?: boolean;
}

export function StarsChartSkeleton({ hasShareButton = false }: StarsChartSkeletonProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-col justify-center gap-1">
          <CardTitle>Stars Over Time</CardTitle>
          <CardDescription>
            Repository star growth daily
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            Total Daily Stars
          </span>
          <Skeleton className="h-6 w-16 sm:h-8 sm:w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {hasShareButton && (
            <div className="h-8 flex justify-end items-center mb-4 gap-2">
              <Skeleton className="h-8 w-20" />
            </div>
          )}
          <div className={hasShareButton ? "h-[calc(100%-2.5rem)] w-full" : "h-full w-full"}>
            <Skeleton className="h-full w-full" />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Tabs value="daily">
            <TabsList>
              <TabsTrigger value="daily" className="cursor-pointer">Daily</TabsTrigger>
              <TabsTrigger value="cumulative" className="cursor-pointer">Cumulative</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}