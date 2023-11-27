import { Navbar, Link } from '@nextui-org/react';
import DropdownWrapper from '@/components/DropdownWrapper';
import Path from '@/components/Path';
import Image from 'next/image';
import { getUserOctokit } from '@/utils/octokit';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userOctokit = await getUserOctokit();
  const { data: user } = await userOctokit.request('GET /user');

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
