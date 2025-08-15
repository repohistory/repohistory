'use client';

import { useSearchParams } from "next/navigation";

interface DashboardViewsProps {
  repoView: React.ReactNode;
  ownerView: React.ReactNode;
}

export function DashboardViews({ repoView, ownerView }: DashboardViewsProps) {
  const searchParams = useSearchParams();
  const viewMode = (searchParams.get('view') === 'owners' ? 'owners' : 'repos');

  return viewMode === 'repos' ? repoView : ownerView;
}