"use client";

import { LoginInputs, UserData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { signInAction } from "../actions/auth/auth.actions";
import { useAuth } from "../auth-context/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthResponse {
  success: boolean;
  data?: UserData | null;
  error?: string | string[];
}

export function useSignIn() {
  const { setUser } = useAuth();
  const router = useRouter();

  const {
    mutate: login,
    isPending: isLoading,
    isError,
    error,
    data,
  } = useMutation<AuthResponse, Error, LoginInputs>({
    mutationFn: async ({ email, password }: LoginInputs) => {
      const success = handleInputErrors({ email, password });
      if (!success) {
        throw new Error("Input validation failed");
      }
      // Call the actual sign-in action
      return await signInAction({ email, password });
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        localStorage.setItem("chat-user", JSON.stringify(response.data));
        document.cookie = `token=${response.data.token}; path=/`;
        setUser(response.data);
        toast.success("Logged in successfully");
        router.push("/");
      } else if (response.error) {
        if (Array.isArray(response.error)) {
          response.error.forEach((msg) => toast.error(msg));
        } else {
          toast.error(response.error);
        }
      }
    },
    onError: (error) => {
      console.log("error occurred during login:", error.message);
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  return { login, isLoading, isError, error, data };
}

function handleInputErrors({ email, password }: LoginInputs) {
  if (!email || !password) {
    toast.error("Please, fill in all fields.");
    return false;
  }

  return true;
}
