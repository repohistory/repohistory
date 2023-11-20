import LoginButton from '@/components/LoginButton';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Repohistory - Sign In',
};

export default function LoginPage({ searchParams }: { searchParams: any }) {
  const { code } = searchParams;

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-login bg-cover bg-center pl-[4%] md:block">
        <Link
          href="https://repohistory.com"
          className="ml-auto mt-20 flex items-center gap-3 text-3xl font-bold
            leading-tight text-white"
        >
          <Image width={35} height={35} src="/images/logo.png" alt="logo" unoptimized />
          repohistory
        </Link>
        <h1
          className="flex flex-col gap-5 pt-64 text-5xl font-semibold
            leading-tight text-white md:text-5xl"
        >
          <div className="mr-2">Effortless Tracking</div>
          <div className="mr-10">Timeless Insights</div>
        </h1>
      </div>
      <div className="w-full bg-[#0A0A0B] md:w-1/2">
        <Link
          href="https://repohistory.com"
          className="ml-auto mt-10 flex items-center gap-3 pl-10 text-2xl
            font-bold leading-tight text-white md:hidden"
        >
          <Image
            width={35}
            height={35}
            alt="logo"
            src="https://github.com/m4xshen/img-host/assets/74842863/e8eaecb6-aeff-4c4e-a242-456dfaddaa76"
            unoptimized
          />
          repohistory
        </Link>
        <h1 className="pt-36 text-center text-4xl font-bold leading-tight text-white">
          Sign In
        </h1>
        <div className="flex flex-col items-center gap-10">
          <LoginButton code={code} />
        </div>
      </div>
    </div>
  );
}
