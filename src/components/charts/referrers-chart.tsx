"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RepoTrafficData } from "@/utils/repoData";

interface ReferrersChartProps {
  traffic: RepoTrafficData;
}

export function ReferrersChart({ traffic }: ReferrersChartProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Referrering Sites</CardTitle>
          <CardDescription>
            Sources driving traffic to your repository
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {traffic.referrers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Unique</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traffic.referrers.map((referrer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {referrer.referrer || "Direct"}
                  </TableCell>
                  <TableCell className="text-right">{referrer.count.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{referrer.uniques.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No referrer data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
