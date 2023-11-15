'use client';

import { Link, NavbarContent } from '@nextui-org/react';
import { usePathname } from 'next/navigation';

export default function Path() {
  const pathname = usePathname();
  const parts = pathname.split('/');

  let owner = '';
  let repo = '';
  if (owner === '' && parts.length === 3) {
    [owner, repo] = parts.slice(1);
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {owner.length !== 0 && repo.length !== 0 ? (
        <NavbarContent justify="start" className="gap-0 text-white">
          <Link
            isExternal
            isBlock
            size="md"
            color="foreground"
            href={`https://github.com/${owner}`}
            className="font-semibold"
          >
            {owner}
          </Link>
          <span className="text-lg font-semibold text-stone-400">/</span>
          <Link
            isExternal
            isBlock
            size="md"
            color="foreground"
            href={`https://github.com/${owner}/${repo}`}
            className="font-semibold"
          >
            {repo}
          </Link>
        </NavbarContent>
      ) : null}
    </>
  );
}
