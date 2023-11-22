/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import updateTraffic from './updateTraffic';
import supabase from '../utils/supabase';

export default async function updateAllTraffic() {
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
}
