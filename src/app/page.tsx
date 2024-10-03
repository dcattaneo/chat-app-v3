"use client";

import { useAuth } from "./auth-context/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetUsers } from "./hooks";
import { useSignOut } from "./hooks";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { data } = useGetUsers();
  const { logout, data: data2 } = useSignOut();

  console.log(user);
  console.log("users", data);
  console.log('data log out', data2);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]); // Only run this effect if user or router changes

  return (
    <div className="w-screen h-screen">
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}
