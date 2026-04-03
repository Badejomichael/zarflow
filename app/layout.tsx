import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/app/context/AppContext";

export const metadata: Metadata = {
  title: "ZarFlow - Finance Dashboard",
  description: "A clean, interactive personal finance dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/logo.PNG"/>
      </head>

      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}