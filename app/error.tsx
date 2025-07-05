"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 text-center">
      <h1 className="text-4xl sm:text-6xl font-bold mb-4">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        An unexpected error occurred. Please try again later or return to the
        homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => reset()}
          variant="default"
          className="rounded-md px-6 py-2"
        >
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="rounded-md px-6 py-2">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
