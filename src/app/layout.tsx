import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/providers';
import PlausibleProvider from 'next-plausible';

export const metadata: Metadata = {
  title: 'Repohistory',
  description:
    'An open-source dashboard for tracking GitHub repo traffic history longer than 14 days.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="app.repohistory.com" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-[#0A0A0B] scrollbar-hide dark`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
