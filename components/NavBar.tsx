import { Logout } from "./logout";

export function NavBar({ email }: { email: string }) {
  return (
    <nav className="border-b mb-4">
      <div className="max-w-7xl mx-auto flex gap-4 items-center justify-end py-2">
        <div className="text-sm">welcome 👋 {email}</div>
        <Logout />
      </div>
    </nav>
  );
}
