import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config: no Prisma adapter, no Credentials provider (both need
 * Node APIs unavailable in the Edge middleware runtime). Extended with
 * those in auth.ts, which is only ever imported from route handlers and
 * server components.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
      return isDashboardRoute ? isLoggedIn : true;
    },
  },
};
