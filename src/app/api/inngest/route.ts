/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import updateTraffic from '@/services/updateTraffic';
import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import supabase from '@/utils/supabase';

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
