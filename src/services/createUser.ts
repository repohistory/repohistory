import { sql } from '@vercel/postgres';

export default async function createUser(githubUserId: number, installationId: number) {
  try {
    await sql`
      INSERT INTO users (github_user_id, installation_id)
      VALUES (${githubUserId}, ${installationId})
      ON CONFLICT (github_user_id) DO 
      UPDATE SET installation_id = EXCLUDED.installation_id
    `;
  } catch (error) {
    console.error('Error creating or updating user:', error);
    throw error;
  }
}

