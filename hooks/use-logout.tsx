import { authClient } from '@/lib/auth-client';

export function useLogout() {
  async function logout() {
    await authClient.signOut();
  }

  return { logout };
}
