import supabase from "@/utils/supabase";

export default async function createInstallation(
  githubUserId: number,
  installationId: number,
) {
  try {
    await supabase
      .from('users')
      .insert([
        { github_user_id: githubUserId, installation_id: installationId },
      ]);
  } catch (error) {
    console.error('Error creating or updating installation:', error);
    throw error;
  }
}
