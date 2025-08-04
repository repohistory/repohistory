'use client';

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  shouldShowOwnerView: boolean;
  repoView: React.ReactNode;
  ownerView: React.ReactNode;
}

export function DashboardViewSwitcher({ shouldShowOwnerView, repoView, ownerView }: Props) {
  const [viewMode, setViewMode] = useState<'repos' | 'owners'>('repos');

  return (
    <>
      {shouldShowOwnerView && (
        <div className="container mx-auto px-4 pt-8">
          <Select value={viewMode} onValueChange={(value: 'repos' | 'owners') => setViewMode(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="repos">All Repos</SelectItem>
              <SelectItem value="owners">Group by Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {viewMode === 'repos' ? repoView : ownerView}
    </>
  );
}
