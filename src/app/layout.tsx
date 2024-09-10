import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";


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
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
