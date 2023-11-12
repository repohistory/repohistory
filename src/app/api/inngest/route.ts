/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import updateTraffic from '@/services/updateTraffic';
import { App } from 'octokit';
import { SupabaseClient } from '@supabase/supabase-js';
import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';

const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});

const updateAllTraffic = inngest.createFunction(
  { id: 'update-all-traffic' },
  { cron: '*/30 * * * *' },
  async () => {
    const { data, error } = await supabase
      .from('users')
      .select('installation_id');

    if (error) {
      return;
    }

    const installations = data.map((d) => d.installation_id);

    for (const installation of installations) {
      await updateTraffic(app, installation);
    }
  },
);

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [updateAllTraffic],
});
