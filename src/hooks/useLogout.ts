import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';

async function logout(router: AppRouterInstance) {
  destroyCookie(null, 'access_token');
  router.push('/login');
}

export default function useLogout() {
  const router = useRouter();

  return () => logout(router);
}
