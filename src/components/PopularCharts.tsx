"use client";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, FileText } from "lucide-react";
import { RepoTrafficData } from "@/utils/repoData";

interface PopularChartsProps {
  traffic: RepoTrafficData;
}

export function PopularCharts({ traffic }: PopularChartsProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Top Referrers
            </CardTitle>
            <CardDescription>Sources driving traffic to your repository</CardDescription>
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
        </div>

        <div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Popular Content
            </CardTitle>
            <CardDescription>Most visited pages in your repository</CardDescription>
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
        </div>
      </div>
    </>
  );
}
