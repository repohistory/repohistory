'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@nextui-org/react';
import Spinner from '@/components/Icons/Spinner';
import { useRouter } from 'next/navigation';
import GitHub from './Icons/GitHub';

export default function LoginButton({ code }: { code: string | null }) {
  const router = useRouter();

  useEffect(() => {
    if (!code) {
      return;
    }

    (async () => {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-access-token`, {
        headers: {
          Accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ code }),
      });

      router.push('/');
    })();
  }, [code, router]);

  const isLoading = code !== undefined && code !== null;

  return (
    <Button
      spinner={<Spinner />}
      isLoading={isLoading}
      className="mt-10 bg-[#222223] font-semibold text-white"
      radius="sm"
      size="lg"
      as={Link}
      href={`https://github.com/login/oauth/authorize?${new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_APP_CLIENT_ID,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      })}`}
    >
      {isLoading ? null : <GitHub />}
      Continue with GitHub
    </Button>
  );
}
