import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/providers';
import Script from 'next/script';

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
      <head>
        <link
          rel="manifest"
          crossOrigin="use-credentials"
          href="/manifest.json"
        />
        <meta name="application-name" content="Repohistory" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Repohistory" />
        <meta
          name="description"
          content="An open-source dashboard for tracking GitHub repo traffic history longer than 14 days."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0A0A0B" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#0A0A0B" />

        <link rel="apple-touch-icon" href="/icons/512x512.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/180x180.png"
        />
      </head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
      </Script>
      <body
        className={`${inter.className} min-h-screen bg-[#0A0A0B] scrollbar-hide dark`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
