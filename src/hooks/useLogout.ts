import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { destroyCookie } from 'nookies';

async function logout(router: AppRouterInstance) {
  destroyCookie(null, 'access_token', {
    path: '/',
  });
  router.push('/login');
}

export default function useLogout(router: AppRouterInstance) {
  return () => logout(router);
}
