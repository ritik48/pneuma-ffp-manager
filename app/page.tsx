import { auth } from "@/auth";
import { Logout } from "@/components/logout";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const isAutenticated = !!session?.user;

  if (!isAutenticated) {
    redirect("/login");
  }

  console.log({ isAuthenticated: isAutenticated, session });
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div>You are logged in {session.user?.email}</div>
        <Logout />
      </div>
    </div>
  );
}
