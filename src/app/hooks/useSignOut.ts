"use client";

import { useMutation } from "@tanstack/react-query";
import { signOutAction } from "../actions/auth/auth.actions";
import { useAuth } from "../auth-context/hooks/useAuth";
import { toast } from "react-hot-toast";

export function useSignOut() {
  const { setUser } = useAuth();
  const {
    mutate: logout,
    isError,
    error,
    isPending: isLoading,
    data,
  } = useMutation({
    mutationFn: signOutAction,

    onSuccess: () => {
      localStorage.removeItem("chat-user");
      document.cookie = `token=${""}; path="/"`;
      setUser(null);
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return { logout, isError, error, isLoading, data };
}
