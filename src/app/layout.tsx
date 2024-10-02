import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Provider from "@/util/Provider";
import { AuthProvider } from "./auth-context/Auth.Context";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Chat-App",
  description: "Third version",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased `}>
        <Toaster />
        <AuthProvider>
          <Provider>{children}</Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
