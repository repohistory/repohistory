/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import updateStars from '@/services/updateStars';
import { App } from 'octokit';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const { rows } = await sql`
    SELECT installation_id FROM users
  `;
  const installations = rows.map((row) => row.installation_id);

  for (const installation of installations) {
    await updateStars(app, installation);
    await updateStars(app, installation);
  }

  return NextResponse.json({ ok: true });
}
