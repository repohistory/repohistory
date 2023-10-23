import { NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: Request) {
  const { code } = await request.json();

  const res = await fetch(
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

  const data = await res.json();

  return NextResponse.json(data);
}
