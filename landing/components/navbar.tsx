"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/icons/transparent.png" alt="Repohistory" priority width={24} height={24} quality={100} />
              <span className="text-lg font-semibold text-white">Repohistory</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/#features"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="https://github.com/repohistory/repohistory"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </div>
            <div className="hidden md:block">
              <Button asChild size="sm">
                <Link href="https://app.repohistory.com">Get Started</Link>
              </Button>
            </div>
            <div className="md:hidden flex items-center space-x-3">
              <Button asChild size="sm">
                <Link href="https://app.repohistory.com">Get Started</Link>
              </Button>
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 text-neutral-400 hover:text-neutral-300 transition-colors"
                  aria-label="Toggle menu"
                >
                  <div className="w-4 h-3 relative flex flex-col justify-center">
                    <span
                      className={`absolute block h-0.5 w-4 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'rotate-45 top-1' : 'top-0'
                        }`}
                    />
                    <span
                      className={`absolute block h-0.5 w-4 bg-current transition-all duration-300 ease-out ${isMenuOpen ? '-rotate-45 top-1' : 'top-2'
                        }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-lg z-40 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <Link
            href="/#features"
            className="text-2xl text-white hover:text-neutral-300 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-2xl text-white hover:text-neutral-300 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="https://github.com/repohistory/repohistory"
            className="text-2xl text-white hover:text-neutral-300 transition-colors"
            onClick={() => setIsMenuOpen(false)}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </div>
      </div>
    </>
  );
}
