"use client";

import { RegisterInputs, UserData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { signUpAction } from "../actions/auth/auth.actions";
import { useAuth } from "../auth-context/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthResponse {
  success: boolean;
  data?: UserData | null;
  error?: string | string[];
}

export function useSignUp() {
  const { setUser } = useAuth();
  const router = useRouter();

  const {
    mutate: register,
    isPending: isLoading,
    isError,
    error,
    data,
  } = useMutation<AuthResponse, Error, RegisterInputs>({
    mutationFn: async ({ username, email, password }: RegisterInputs) => {
      const success = handleInputErrors({ username, email, password });
      if (!success) {
        throw new Error("Input validation failed");
      }
      // Call the actual sign-up action
      return await signUpAction({ username, email, password });
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        localStorage.setItem("chat-user", JSON.stringify(response.data));
        document.cookie = `token=${response.data.token}; path=/`;
        setUser(response.data);
        toast.success("Registered successfully");
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
      console.log("an error has occurred during register:", error.message);
      toast.error(
        error.message || "Register attempt failed. Please try again."
      );
    },
  });

  return { register, isLoading, isError, error, data };
}

function handleInputErrors({ username, email, password }: RegisterInputs) {
  if (!username || !email || !password) {
    toast.error("Please, fill in all fields.");
    return false;
  }

  return true;
}
