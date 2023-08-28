'use client';

import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      (async () => {
        const response = await fetch(
          `https://github.com/login/oauth/access_token?${new URLSearchParams({
            code,
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          })}`,
          {
            headers: {
              Accept: 'application/json',
            },
            method: 'POST',
          },
        );
        const data = await response.json();
        console.log(data.access_token);
      })();
    }
  }, [code]);

  return (
    <div className="flex flex-col items-center gap-10">
      <div>
        <h1 className="pt-36 text-center text-7xl font-bold text-white">
          repohistory
        </h1>
        <h2 className="mt-4 text-center text-lg text-white">
          View traffic history of your repository
        </h2>
      </div>
      <div>
        <Button className="bg-[#1f6feb] text-white">
          <Link
            href={`https://github.com/login/oauth/authorize?${new URLSearchParams(
              {
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                redirect_url: 'http://localhost:3000/login',
              },
            )}`}
          >
            GitHub Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
