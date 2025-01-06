'use client'
import React from 'react'
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/ui/sidebar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:ml-[240px] bg-neutral-100 h-screen">{children}</main>
    </div>
  );
}