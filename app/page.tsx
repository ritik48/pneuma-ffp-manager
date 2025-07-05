import { auth } from "@/auth";
import FrequentFlyerTable from "@/components/frequent-flyer-table";
import { NavBar } from "@/components/NavBar";
import Provider from "@/components/Provider";
import { redirect } from "next/navigation";

export default async function FrequentFlyersPage() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.email);
  if (!isAuthenticated) {
    redirect("/login");
  }
  return (
    <div className="">
      <NavBar email={session!.user!.email as string} />
      <div className="max-w-7xl mx-auto">
        <Provider>
          <FrequentFlyerTable />
        </Provider>
      </div>
    </div>
  );
}
