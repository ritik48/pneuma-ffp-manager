import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  email: string;
  password: string;
  _id: string;
}

declare module "next-auth" {
  interface User extends IUser {}
  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
