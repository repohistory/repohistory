'use client';

import { Button } from '@nextui-org/button';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-10">
      <div>
        <h1 className="pt-36 text-center text-7xl font-bold text-white">
          repohistory
        </h1>
        <h2 className="mt-4 text-center text-lg text-white">
          View traffic history of your repository
        </h2>
      </div>
      <div>
        <Button className="bg-[#1f6feb] text-white">GitHub Login</Button>
      </div>
    </div>
  );
}
