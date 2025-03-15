import type React from "react"
import type { Metadata } from "next"
import LayoutContent from "../LayoutContent"

export const metadata: Metadata = {
  title: "Mystic Online",
  description: "Built by Mystics for Mystics",
}

interface LayoutProps {
  children: React.ReactNode
  types: string[] 
}

export default function RootLayout({ children }: LayoutProps) {
  return <LayoutContent>{children}</LayoutContent>
}

