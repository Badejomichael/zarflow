import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/app/context/AppContext";

export const metadata: Metadata = {
  title: "FinFlow - Finance Dashboard",
  description: "A clean, interactive personal finance dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}