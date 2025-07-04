import NextAuth from "next-auth";

import { User } from "@/app/_models/user.model";

import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./lib/db";
import { IUser } from "@/app/_models/user.model";
import bcrypt from "bcrypt";
import type { User as NextAuthUser } from "next-auth";
import { Types } from "mongoose";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async ({ email, password }) => {
        if (!email || !password) {
          return null;
        }

        await connectDB();

        const user = (await User.findOne({ email }).select(
          "+password"
        )) as IUser | null;
        if (!user) {
          return null;
        }

        const isMatch = await bcrypt.compare(password as string, user.password);
        if (!isMatch) {
          console.log({ isMatch, user });
          return null;
        }

        return {
          id: (user._id as Types.ObjectId).toString(),
          email: user.email,
        } as NextAuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.sub = user.id;
      }
      return token;
    },
    async session({ token, session }) {
      if (session?.user) {
        session.user.email = token.email as string;
        session.user._id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
