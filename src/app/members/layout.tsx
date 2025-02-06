import type { Metadata } from "next";


import "../globals.css";
import LayoutContent from "../LayoutContent";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mystic Online | Members",
  description: "Built by Mystics for Mystics",
};

export default function RootLayout({ children } : {children: ReactNode}) {
  return <LayoutContent>{children}</LayoutContent>;
}
