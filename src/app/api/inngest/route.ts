/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import updateTraffic from '@/services/updateTraffic';
import { SupabaseClient } from '@supabase/supabase-js';
import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';

const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const updateAllTraffic = inngest.createFunction(
  { id: 'update-all-traffic' },
  { cron: '* */12 * * *' },
  async () => {
    const { data, error } = await supabase
      .from('users')
      .select('installation_id');

    if (error) {
      return;
    }

    const installations = data.map((d) => d.installation_id);

    for (const installation of installations) {
      await updateTraffic(installation);
    }
  },
);

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [updateAllTraffic],
});
