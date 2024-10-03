"use client";

import { LoginInputs } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { signInAction } from "../actions/auth/auth.actions";
import { useAuth } from "../auth-context/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useSignIn() {
  const { setUser } = useAuth();
  const router = useRouter();

  const {
    mutate: login,
    isPending: isLoading,
    isError,
    error,
    data,
  } = useMutation({
    mutationFn: async ({ email, password }: LoginInputs) => {
      // Validate inputs before making the API call
      const success = handleInputErrors({ email, password });
      if (!success) {
        throw new Error("Input validation failed");
        // return;
      }

      // Call the actual sign-in action
      return await signInAction({ email, password });
    },
    onSuccess: (data) => {
      localStorage.setItem("chat-user", JSON.stringify(data));
      document.cookie = `token=${data.token}; path="/"`;
      setUser(data);
      toast.success("Logged in successfully");
      router.push("/");
    },
    onError: (error) => {
      const message = error.message;
      console.log("error occurred during login:", message);
      toast.error("Login failed. Please try again");
    },
  });

  return { login, isLoading, isError, error: error as Error, data };
}

function handleInputErrors({ email, password }: LoginInputs) {
  if (!email || !password) {
    toast.error("Please, fill in all  fields");
    return false;
  }

  return true;
}
