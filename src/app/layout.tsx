import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/providers';

export const metadata: Metadata = {
  title: 'Repohistory',
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
