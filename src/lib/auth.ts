import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
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

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          role: user.role,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          chefCode: user.chefCode,
          connectedChefId: user.connectedChefId,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.displayName = (user as any).displayName;
        token.avatarUrl = (user as any).avatarUrl;
        token.chefCode = (user as any).chefCode;
        token.connectedChefId = (user as any).connectedChefId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).displayName = token.displayName as string | null;
        (session.user as any).avatarUrl = token.avatarUrl as string | null;
        (session.user as any).chefCode = token.chefCode as string | null;
        (session.user as any).connectedChefId = token.connectedChefId as string | null;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
