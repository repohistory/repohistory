'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setCookie } from 'nookies';
import useLogin from '@/hooks/useLogin';
import { Button } from '@nextui-org/react';
import Spinner from '@/components/Icons/Spinner';
import { Octokit } from 'octokit';

export default function LoginButton({ code }: { code: string | null }) {
  const router = useRouter();
  const login = useLogin();

  useEffect(() => {
    (async () => {
      if (!code) {
        return;
      }

      const { data, error } = await login(code);
      if (!error) {
        const userOctokit = new Octokit({
          auth: data.access_token,
        });
        const { data: user } = await userOctokit.request('GET /user');

        setCookie(null, 'access_token', data.access_token, {
          maxAge: 3600,
          path: '/',
        });
        setCookie(null, 'user_id', user.id.toString(), {
          maxAge: 3600,
          path: '/',
        });

        router.push('/dashboard');
      } else {
        console.error(error);
      }
    })();
  }, [code, login, router]);

  return (
    <Button
      spinner={<Spinner />}
      isLoading={code !== undefined && code !== null}
      className="mt-10"
      color="default"
      radius="sm"
      size="lg"
      variant="bordered"
      as={Link}
      href={`https://github.com/login/oauth/authorize?${new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      })}`}
    >
      Continue with GitHub
    </Button>
  );
}
