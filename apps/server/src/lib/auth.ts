// auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { expo } from "@better-auth/expo";
import { client } from "../db";

type UserWithCity = {
  id: string;
  email: string;
  city?: string;
  [key: string]: any;
};

type SessionCallbackArgs = {
  session: { user: Record<string, any> };
  user: UserWithCity;
};
export const auth = betterAuth({
  database: mongodbAdapter(client),
  trustedOrigins: [
    process.env.CORS_ORIGIN || "",
    "krishi-mitra://",
  ],
  user: {
    additionalFields: {
      city: { type: "string", required: false }
    },
    modelName: 'user'
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [expo()],
});