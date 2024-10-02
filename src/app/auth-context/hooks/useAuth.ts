"use client";
import { useContext } from "react";
import { AuthContext } from "../Auth.Context";
import { AuthContextType } from "../Auth.Context";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
