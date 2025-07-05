"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export function Logout() {
  return (
    <Button size={"sm"} onClick={() => signOut({ redirectTo: "/login" })}>
      Logout
    </Button>
  );
}
