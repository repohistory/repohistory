import supabase from "@/utils/supabase";

export default async function deleteUser(githubUserId: number) {
  try {
    await supabase.from('users').delete().eq('github_user_id', githubUserId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
