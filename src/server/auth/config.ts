import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { db } from "@/server/db";
import { admins, users } from "@/server/db/schemas/users";
import {
  accounts,
  sessions,
  verificationTokens,
} from "@/server/db/schemas/auth";
import { type SqlFlavorOptions } from "node_modules/@auth/drizzle-adapter/lib/utils";
import { env } from "@/env";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authConfig = {
  providers: [
    GithubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter<SqlFlavorOptions>(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: async ({ session, user }) => {
      const isAdmin = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .innerJoin(admins, eq(users.id, admins.userId));

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isAdmin: isAdmin.length > 0,
        },
      };
    },
  },
} satisfies NextAuthConfig;
