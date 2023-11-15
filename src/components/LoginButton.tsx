'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@nextui-org/react';
import Spinner from '@/components/Icons/Spinner';
import { useRouter } from 'next/navigation';

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
  }, [code]);

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
