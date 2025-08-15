'use client';

import { useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DashboardViewSwitcher() {
  const searchParams = useSearchParams();
  const viewMode = (searchParams.get('view') === 'owners' ? 'owners' : 'repos');

  const handleViewChange = (value: 'repos' | 'owners') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', value);
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 pt-8">
      <Select value={viewMode} onValueChange={handleViewChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="repos">All Repos</SelectItem>
          <SelectItem value="owners">Group by Owner</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
