import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// eslint-disable-next-line import/prefer-default-export
export async function fetchInstallationId(userId: string) {
  if (!userId) return null;

  try {
    const { data } = await supabase
      .from('users')
      .select('installation_id')
      .eq('github_user_id', userId);

    if (data && data.length > 0) {
      return data[0].installation_id;
    }

    return null;
  } catch (error) {
    console.error('Error fetching installation ID:', error);
    throw error;
  }
}
