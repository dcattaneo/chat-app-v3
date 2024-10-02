"use client";

import { useAuth } from "./auth-context/hooks/useAuth";
import { useGetUsers } from "./hooks/useGetUsers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, isError, error, isLoading } = useGetUsers();
  console.log(user);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]); // Only run this effect if user or router changes

  return <div className="w-screen h-screen">Home</div>;
}
