import 'react-native-url-polyfill/auto';

import { authClient } from '@/lib/auth-client';

export function getApiBaseUrl(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
}

/** Fetch autenticato verso Next / Payload (cookie sessione Better Auth via plugin Expo). */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers(init.headers);
  const cookie = authClient.getCookie();
  if (cookie) {
    headers.set('Cookie', cookie);
  }
  if (
    init.body !== undefined &&
    init.body !== null &&
    !headers.has('Content-Type') &&
    !(typeof FormData !== 'undefined' && init.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...init,
    headers,
    credentials: 'omit',
  });
}
