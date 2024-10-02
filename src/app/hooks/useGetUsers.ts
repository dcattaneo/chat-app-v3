"use client";

import { useQuery } from "@tanstack/react-query";
import { currentUserAction } from "../actions/auth/auth.actions";

export function useGetUsers() {
  const {
    data,
    isError,
    error,
    isPending: isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => currentUserAction(),
    staleTime: 1000 * 60 * 5,
  });

  return { data, isError, error, isLoading };
}
