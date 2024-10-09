import type { Metadata } from "next";
// import localFont from "next/font/local";
import "../globals.css";
import LayoutContent from "../LayoutContent";

// const geistSans = localFont({
//   src: "../fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

// const geistMono = localFont({
//   src: "../fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

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