import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config: no Prisma adapter, no bcrypt. Used directly by
// middleware (which runs on the Edge runtime and can't load Node built-ins)
// and extended with the Credentials provider + adapter in lib/auth.ts for
// everything else (API routes, server components).
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      return isOnDashboard ? isLoggedIn : true;
    },
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
