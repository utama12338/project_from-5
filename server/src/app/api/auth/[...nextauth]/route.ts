import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from "@auth/prisma-adapter";
import argon2 from 'argon2';

// Initialize Prisma client
const prisma = new PrismaClient();

// Configure NextAuth options
const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
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
            email: user.email,
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
    async session({ session, user }) {
      if (session?.user) {
        session.user.role = user.role;
        session.user.id = user.id;
      }
      return session;
    }
  },
  session: {
    strategy: "database"
  },
  pages: {
    signIn: process.env.NEXT_PUBLIC_FRONTEND_URL 
  }
};

// Create and export handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };