import supabase from './supabase';

// eslint-disable-next-line import/prefer-default-export
export async function fetchInstallationIds(userId: string) {
  if (!userId) return [];

  try {
    const { data } = await supabase
      .from('users')
      .select('installation_id')
      .eq('github_user_id', userId);

    if (data && data.length > 0) {
      return data.map((d) => d.installation_id);
    }

    return [];
  } catch (error) {
    console.error('Error fetching installation ID:', error);
    throw error;
  }
}
