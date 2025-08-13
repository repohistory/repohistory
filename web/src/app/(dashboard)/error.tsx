'use client';

import { useEffect } from 'react';
import { signout } from '@/actions/auth';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
    signout();
  }, [error]);

  return null;
}
