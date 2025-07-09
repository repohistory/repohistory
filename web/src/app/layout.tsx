import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repohistory",
  description: "An open-source dashboard for tracking GitHub repo traffic history longer than 14 days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Repohistory" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
