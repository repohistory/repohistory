import { useEffect, useState } from 'react';
import { sql } from '@vercel/postgres';

export default function useInstallationId(userId: number | null) {
  const [installationId, setInstallationId] = useState(null);

  useEffect(() => {
    const fetchInstallationId = async () => {
      console.log(userId);
      try {
        const result = await sql`
          SELECT installation_id FROM users WHERE github_user_id = ${userId}
        `;

        // Access the rows from the result
        // Adjust this according to the structure of your query result
        if (result.rows && result.rows.length > 0) {
          setInstallationId(result.rows[0].installation_id);
        }
      } catch (error) {
        console.error('Error fetching installation ID:', error);
        // Handle the error appropriately
      }
    };

    if (userId) {
      fetchInstallationId();
    }
  }, [userId]);

  return installationId;
}
