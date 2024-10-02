"use client";

import { useEffect } from "react";
import { useAuth } from "./auth-context/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      router.push("/sign-in");
    }
  }, [user, router]);

  return null;
}
