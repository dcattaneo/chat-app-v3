"use client";

import { RegisterInputs } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { signUpAction } from "../actions/auth/auth.actions";
import { useAuth } from "../auth-context/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useSignUp() {
  const { setUser } = useAuth();
  const router = useRouter();

  const {
    mutate: register,
    isPending: isLoading,
    isError,
    error,
    data,
  } = useMutation({
    mutationFn: async ({ username, email, password }: RegisterInputs) => {
      const success = handleInputErrors({ username, email, password });
      if (!success) {
        throw new Error("Input validation failed");
        // return
      }
      // Call the actual sign-up action
      return await signUpAction({ username, email, password });
    },
    onSuccess: (data) => {
      localStorage.setItem("chat-user", JSON.stringify(data));
      document.cookie = `token=${data.token}; path="/"`;
      setUser(data);
      toast.success("Registered  successfully");
      router.push("/");
    },
    onError: (error) => {
      console.log("an error has occurred during register:", error.message);
      toast.error(error.message || "Register attempt failed. Please try again");
    },
  });

  return { register, isLoading, isError, error, data };
}

function handleInputErrors({ username, email, password }: RegisterInputs) {
  if (!username || !email || !password) {
    toast.error("Please, fill in all  fields");
    return false;
  }

  return true;
}
