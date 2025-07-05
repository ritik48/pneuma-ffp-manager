import { Logout } from "./logout";
import { ModeToggle } from "./theme-toggle";

export function NavBar({ email }: { email: string }) {
  return (
    <nav className="border-b mb-4">
      <div className="max-w-7xl mx-auto flex gap-4 items-center justify-end py-2 px-3">
        <div className="text-sm hidden sm:block">welcome 👋 {email}</div>
        <ModeToggle />
        <Logout />
      </div>
    </nav>
  );
}
