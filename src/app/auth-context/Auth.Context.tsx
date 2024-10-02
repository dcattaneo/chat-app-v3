"use client";

import { createContext, useState, useEffect } from "react";
import { UserData } from "@/types";

export type ProviderProps = {
  children: React.ReactNode;
};

export type AuthContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Access localStorage only on the client
      const chatUserJson = localStorage.getItem("chat-user") as string;
      const parsedUserJson = chatUserJson !== null && JSON.parse(chatUserJson);
      setUser(parsedUserJson || null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
