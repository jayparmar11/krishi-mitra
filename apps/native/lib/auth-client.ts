import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from '../../server/src/lib/auth';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      storagePrefix: "krishi-mitra",
      storage: SecureStore,
    }),
    inferAdditionalFields<typeof auth>()
  ],
});
