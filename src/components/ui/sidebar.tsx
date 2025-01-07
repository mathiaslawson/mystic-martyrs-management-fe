"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Users, Menu, ArrowLeftIcon, Church, Radar, Navigation, UserRoundPlus } from "lucide-react"

const sidebarItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Members", href: "/members", icon: Users },
  { name: "Fellowhips", href: "/fellowships", icon: Church },
  { name: "Zones", href: "/zones", icon: Navigation },
  { name: "Cells", href: "/cells", icon: Radar },
  { name: "Attendance Records", href: "/attendance/attendance-records", icon: Radar },
  // { name: "Cell Summary", href: "/attendance/cell-summary", icon: Radar },
  { name: "Cell Member Statistics", href: "/attendance/cell-member-stats", icon: Radar },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  // { name: "Settings", href: "/settings", icon: Settings },
  // { name: "Help", href: "/help", icon: HelpCircle },
  { name: "Logout", href: "/help", icon: ArrowLeftIcon }
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  console.log(pathname, 'his is the path name')


  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed left-4 top-4 z-50">
            <Menu className="h-4 w-4 " />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>
      <aside className="hidden lg:flex h-screen w-[240px] flex-col fixed inset-y-0">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col border-r bg-neutral-100 text-black">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          {/* <Package2 className="h-6 w-6" /> */}
          <span>Mystic Martyrs</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              asChild
              variant={pathname === item.href ? "destructive" : "ghost"}
              className={`justify-start ${pathname === item.href ? "text-purple-700" : "text-neutral-800"}`}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}