'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setCookie } from 'nookies';
import { Button } from '@nextui-org/button';
import useLogin from '@/hooks/useLogin';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const login = useLogin();
  const code = searchParams.get('code');

  useEffect(() => {
    (async () => {
      if (code) {
        const { data, error } = await login(code);
        if (!error) {
          setCookie(null, 'access_token', data.access_token, {
            maxAge: 3600,
            path: '/',
          });
          router.push('/');
        } else {
          alert(error);
        }
      }
    })();
  }, [code, login, router]);

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
