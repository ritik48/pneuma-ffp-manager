"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const err = searchParams.get("error");

  useEffect(() => {
    if (!err) return;

    if (err === "CredentialsSignin") {
      toast.error("Invalid credentials");
    } else {
      toast.error("Something went wrong");
    }
  }, [err]);

  return null;
}