import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default async function deleteUser(githubUserId: number) {
  try {
    await supabase.from('users').delete().eq('github_user_id', githubUserId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
