/* eslint-disable import/prefer-default-export */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import updateTraffic from "@/services/updateTraffic";
import supabase from "@/utils/supabase";

async function updateAllTraffic() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('installation_id');

    if (error) {
      throw new Error(error.message);
    }

    const installations = data.map((d) => d.installation_id);

    for (const installation of installations) {
      await updateTraffic(installation);
    }
  } catch (err) {
    console.error('Error updating traffic:', err);
  }
}

export async function POST() {
  await updateAllTraffic();
  return new Response('', { status: 200 });
}
