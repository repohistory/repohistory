import fetcher from '@/utils';
import useSWR from 'swr';

// function isDataRepo(data: any) {
//   // eslint-disable-next-line no-restricted-syntax
//   for (const item of data.tree) {
//     const pathParts = item.path.split('/');
//
//     if (pathParts.length >= 4 && pathParts[2] === 'ghrs-data') {
//       return true;
//     }
//   }
//
//   return false;
// }

export default function useRepos(userId: number) {
  // TODO: use sql to get the repos list from a user id
  // const octokit = await app.getInstallationOctokit(installationId);
  // const response = await octokit.request('GET /installation/repositories');
  // const { repositories } = response.data;

  return [];
}
