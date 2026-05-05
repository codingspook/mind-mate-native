import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? '';

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    expoClient({
      scheme: 'minimal',
      storagePrefix: 'mind-mate-native',
      storage: SecureStore,
    }),
  ],
});

export type AuthSession = typeof authClient.$Infer.Session;
