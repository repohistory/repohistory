import supabase from '@/utils/supabase';

export default async function deleteInstallation(installationId: number) {
  try {
    await supabase.from('users').delete().eq('installation_id', installationId);
  } catch (error) {
    console.error('Error deleting installation:', error);
    throw error;
  }
}
