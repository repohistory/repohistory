import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/providers';

export const metadata: Metadata = {
  title: 'repohistory',
  description:
    'Repohistory is a GitHub repository traffic history tracker that keeps records beyond the standard 14 days, offering an easy and detailed long-term view.',
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
        className={`${inter.className} min-h-screen bg-[#0A0A0B] dark no-scrollbar`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
