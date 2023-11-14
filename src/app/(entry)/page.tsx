import Shade1 from '@/components/Shade1';
import { Button, Image } from '@nextui-org/react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <Shade1 />
      <div className="flex flex-col items-center gap-4 px-5">
        <h1 className="pt-20 text-center text-6xl font-bold leading-tight text-white sm:pt-36 md:text-7xl">
          <div>Effortless Tracking</div>
          <div className="text-[#62C3F8]">Timeless Insights</div>
        </h1>
        <h2 className="my-5 max-w-3xl text-center text-base text-white md:text-xl">
          Repohistory is a GitHub repository traffic history tracker that keeps
          records beyond the standard 14 days, offering an easy and detailed
          long-term view.
        </h2>
        <Button
          className="font-medium"
          color="primary"
          radius="sm"
          size="lg"
          as={Link}
          href="/login"
        >
          Get Started
        </Button>
        <Image
          className="mx-auto my-10 border border-[#202225]"
          width="90%"
          alt="screenshot of repohistory"
          src="/demo.png"
        />
      </div>
    </>
  );
}
