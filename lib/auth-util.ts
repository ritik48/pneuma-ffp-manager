"use server";

import { auth } from "@/auth";

export async function checkAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You are not loggedin.");
  }
}
