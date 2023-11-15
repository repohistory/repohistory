import LoginButton from '@/components/LoginButton';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage({ searchParams }: { searchParams: any }) {
  const { code } = searchParams;

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-login bg-cover pl-[4%] md:block">
        <Link
          href="https://repohistory.com"
          className="ml-auto mt-20 flex items-center gap-3 text-3xl font-bold leading-tight text-white"
        >
          <Image width={35} height={35} src="/repohistory.png" alt="logo" />
          repohistory
        </Link>
        <h1 className="flex flex-col gap-5 pt-64 text-5xl font-semibold leading-tight text-white md:text-5xl">
          <div className="mr-2">Effortless Tracking</div>
          <div className="mr-10">Timeless Insights</div>
        </h1>
      </div>

      <div className="w-full bg-[#111111] md:w-1/2">
        <Link
          href="https://repohistory.com"
          className="ml-auto mt-20 flex items-center gap-3 pl-[10%] text-3xl font-bold leading-tight text-white md:hidden"
        >
          <Image
            width={35}
            height={35}
            alt="logo"
            src="/repohistory.png"
            unoptimized
          />
          repohistory
        </Link>
        <h1 className="pt-36 text-center text-4xl font-bold leading-tight text-white">
          Login
        </h1>
        <div className="flex flex-col items-center gap-10">
          <LoginButton code={code} />
        </div>
      </div>
    </div>
  );
}
