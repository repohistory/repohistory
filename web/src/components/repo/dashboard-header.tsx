'use client';

import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const searchParams = useSearchParams();
  const viewMode = (searchParams.get('view') === 'owners' ? 'owners' : 'repos');

  const handleViewChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', value);
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={handleViewChange}>
          <TabsList>
            <TabsTrigger value="repos">Repos</TabsTrigger>
            <TabsTrigger value="owners">Owners</TabsTrigger>
          </TabsList>
        </Tabs>
        <Link href="https://github.com/apps/repohistory/installations/new" rel="noopener noreferrer">
          <Button variant="secondary">
            <Plus className="h-4 w-4" />
            Add Repos
          </Button>
        </Link>
      </div>
    </div>
  );
}
