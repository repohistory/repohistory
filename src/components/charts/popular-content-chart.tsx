"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface PopularContentChartProps {
  traffic: {
    paths: Array<{
      path: string;
      title: string;
      count: number;
      uniques: number;
    }>;
  };
}

export function PopularContentChart({ traffic }: PopularContentChartProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Popular Content</CardTitle>
          <CardDescription>
            Most visited pages in your repository
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {traffic.paths.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Unique</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traffic.paths.map((path, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{path.path}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{path.title}</TableCell>
                  <TableCell className="text-right">{path.count.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{path.uniques.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No content data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}