import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "../components/@Global/context/UserContext";

export const metadata: Metadata = {
  title: "Mystic Online",
  description: "Built by Mystics for Mystics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
        {children}
        </UserProvider>
        
         <Toaster />
      </body>
    </html>
  );
}