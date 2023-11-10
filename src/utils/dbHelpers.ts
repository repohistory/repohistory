import { sql } from '@vercel/postgres';

// eslint-disable-next-line import/prefer-default-export
export async function fetchInstallationId(userId: string) {
  if (!userId) return null;

  try {
    const result = await sql`
      SELECT installation_id FROM users WHERE github_user_id = ${userId}
    `;

    if (result.rows && result.rows.length > 0) {
      return result.rows[0].installation_id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching installation ID:', error);
    throw error;
  }
}
