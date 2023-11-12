import { Button, Image } from '@nextui-org/react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-4 px-5">
      <h1 className="pt-36 text-center text-6xl font-bold leading-tight text-white md:text-7xl">
        Track your repo&rsquo;s history.
      </h1>
      <h2 className="max-w-xl text-center text-base text-stone-400 md:text-xl">
        Analyze and track your GitHub repository traffic history longer than 14
        days with repohistory.
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
      <Image
        className="mx-auto my-10 border border-[#202225]"
        width="80%"
        alt="screenshot of repohistory"
        src="https://github.com/repohistory/repohistory/assets/74842863/b722d95d-3c41-4ee4-9d9c-d8b6e621b6f9"
      />
    </div>
  );
}
