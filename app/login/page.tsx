'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setCookie } from 'nookies';
import { Button } from '@nextui-org/react';
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
          router.push('/dashboard');
          router.refresh();
        } else {
          alert(error);
        }
      }
    })();
  }, [code, login, router]);

  return (
    <div className="flex flex-col items-center gap-10">
      <Button
        isLoading={code !== null}
        className="mt-52"
        color="default"
        radius="sm"
        size="lg"
        variant="flat"
        as={Link}
        href={`https://github.com/login/oauth/authorize?${new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
        })}`}
      >
        Continue with GitHub
      </Button>
    </div>
  );
}
