import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/providers';

export const metadata: Metadata = {
  title: 'repohistory',
  description:
    'Analyze and track your GitHub repository traffic history longer than 14 days with repohistory.',
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
        className={`${inter.className} min-h-screen bg-black dark scrollbar-hide`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
