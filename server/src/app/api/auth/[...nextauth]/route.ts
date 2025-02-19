import NextAuth, { DefaultSession, NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

// Extend the built-in types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    role: string;
    name: string;
  }
}

// Initialize Prisma client
const prisma = new PrismaClient();

// Configure NextAuth options
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await argon2.verify(user.password, credentials.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.username,
            role: user.role
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  session: {
    strategy: "database" as const,
    maxAge: 0.5 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: process.env.NEXT_PUBLIC_FRONTEND_URL || "/auth/signin"
  },
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: true,
  //     },
  //   },
  //   callbackUrl: {
  //     name: `__Secure-next-auth.callback-url`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: true,
  //     },
  //   },
  //   csrfToken: {
  //     name: `__Host-next-auth.csrf-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: true,
  //     },
  //   },
  // },
};

// Create and export handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };