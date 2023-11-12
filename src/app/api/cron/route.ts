/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { App } from 'octokit';
import updateTraffic from '@/services/updateTraffic';

const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const { data, error } = await supabase
    .from('users')
    .select('installation_id');
  if (error) {
    return NextResponse.json({ ok: false });
  }

  const installations = data.map((d) => d.installation_id);

  for (const installation of installations) {
    updateTraffic(app, installation);
  }

  return NextResponse.json({ ok: true });
}
