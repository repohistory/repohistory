import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/providers';

export const metadata: Metadata = {
  title: 'Repohistory - A GitHub repo traffic history tracker',
  description:
    'Repohistory is an open-source platform for tracking GitHub repo traffic history longer than 14 days, offering an easy and detailed long-term view.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} no-scrollbar min-h-screen bg-[#0A0A0B] dark`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
