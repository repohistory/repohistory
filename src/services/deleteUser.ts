import { sql } from '@vercel/postgres';

export default async function deleteUser(githubUserId: number) {
  try {
    await sql`
      DELETE FROM users
      WHERE github_user_id = ${githubUserId}
    `;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
