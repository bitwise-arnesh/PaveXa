import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as authSchema from "@/db/schemas/auth-schema";
import { username, admin } from "better-auth/plugins";

import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema:authSchema
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    username(),
    admin(),
  ],
});