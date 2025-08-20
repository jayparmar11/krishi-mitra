// auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { expo } from "@better-auth/expo";
import { client } from "../db";

export const auth = betterAuth({
  database: mongodbAdapter(client),
  trustedOrigins: [
    process.env.CORS_ORIGIN || "",
    "krishi-mitra://",
  ],
  user: {
    additionalFields: {
      city: { type: "string", required: false, fieldName: "city", returned: true },
    },
    modelName: 'user'
  },
  logger: {
    log(level, message, ...args) {
      console[level](message, ...args);
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [expo()],
});