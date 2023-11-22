import { Navbar, Link } from '@nextui-org/react';
import DropdownWrapper from '@/components/DropdownWrapper';
import Path from '@/components/Path';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { Octokit } from 'octokit';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const octokit = new Octokit({
    auth: cookies().get('access_token')?.value ?? '',
  });
  const { data: user } = await octokit.request('GET /user');

  return (
    <>
      <Navbar
        isBordered
        height="4.0rem"
        className="border-[#303031] bg-[#050506] bg-opacity-80 backdrop-blur-md backdrop-filter"
        classNames={{
          base: 'justify-between',
          wrapper: 'max-w-full sm:px-10',
        }}
      >
        <Link href="/" className="hover:opacity-100">
          <Image
            width={32}
            height={32}
            alt="logo"
            src="/images/logo.png"
            unoptimized
          />
        </Link>
        <Path />
        <DropdownWrapper user={user} />
      </Navbar>
      <div className="w-full overflow-y-auto scrollbar-hide">{children}</div>
    </>
  );
}
