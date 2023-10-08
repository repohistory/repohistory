'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="leading-tight pt-36 text-center text-6xl font-bold text-white md:text-7xl">
        Track your repo&rsquo;s history.
      </h1>
      <h2 className="text-center text-base text-stone-400 md:text-xl">
        Analyze and track your GitHub repository traffic history with
        repohistory.
      </h2>
      <Button
        className="mt-5 font-medium"
        color="primary"
        radius="sm"
        size="lg"
        variant="shadow"
        as={Link}
        href="/login"
      >
        Get Started
      </Button>
    </div>
  );
}
