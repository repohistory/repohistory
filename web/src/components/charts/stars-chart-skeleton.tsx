import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function StarsChartSkeleton() {
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
          <div className="h-8 flex justify-end items-center mb-4">
            {/* Space for zoom reset button */}
          </div>
          <div className="h-[calc(100%-2.5rem)] w-full">
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