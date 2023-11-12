import '@/globals.css';
import type { Metadata } from 'next';
import { Navbar, Link } from '@nextui-org/react';
import DropdownWrapper from '@/components/DropdownWrapper';
import Image from 'next/image';
import Path from '@/components/Path';

import { Inter } from 'next/font/google';
import Providers from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'repohistory',
  description:
    'Analyze and track your GitHub repository traffic history longer than 14 days with repohistory in the dashboard page.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-black dark scrollbar-hide`}
      >
        <Navbar
          isBordered
          height="4.0rem"
          className="border-[#202225]"
          classNames={{
            base: 'justify-between',
            wrapper: 'max-w-full sm:px-10',
          }}
        >
          <Link href="/" className="hover:opacity-100">
            <Image
              width={30}
              height={30}
              alt="logo"
              src="/repohistory.png"
              unoptimized
            />
          </Link>
          <Path />
          <DropdownWrapper />
        </Navbar>
        <Providers>
          <div className="w-full overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
