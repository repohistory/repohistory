/* eslint-disable import/prefer-default-export */

import supabase from './supabase';

export async function getLimit(installationId: number) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('installation_id', installationId);

  return error ? 2 : data[0].repository_limit ?? 2;
}
