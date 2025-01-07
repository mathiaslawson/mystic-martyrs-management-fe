import type { Metadata } from "next";
import "../../globals.css";
import LayoutContent from "@/app/LayoutContent";

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
   
        <LayoutContent>{children}</LayoutContent>
    
 
  );
}