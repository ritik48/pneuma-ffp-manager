// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 sm:px-4 text-center">
      <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4">
        404
      </h1>
      <p className="text-xl sm:text-2xl font-semibold mb-2">Page Not Found</p>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="rounded-xl px-6 py-2 text-base shadow-md hover:shadow-lg transition">
          Go to Home
        </Button>
      </Link>
    </div>
  );
}
