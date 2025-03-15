"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Menu,
  ArrowLeftIcon,
  Church,
  Radar,
  Navigation,
  UserRoundPlus,
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore"
import { cn } from "@/lib/utils"
import { FileChartColumn } from 'lucide-react';

// Updated AdminItems with nested structure for submenus
const AdminItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Fellowships", href: "/fellowships", icon: Church },
  { name: "Zones", href: "/zones", icon: Navigation },
  { name: "Cell Management", href: "/cells", icon: Radar },
  { name: "Members", href: "/members", icon: Radar },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  { name: "Examinations", href: "/examinations", icon: BookOpenCheck },
  { name: "Performance", href: "/performance", icon: FileChartColumn },
  { name: "Logout", href: "/logout", icon: ArrowLeftIcon },
]

const CellLeaderItems = [
  { name: "Home", href: "/home", icon: Home },
  {
    name: "Attendance",
    icon: Radar,
    subItems: [
      { name: "Attendance Records", href: "/cells/attendance/attendance-records", icon: Radar },
      { name: "Cell Attendance Statistics", href: "/cells/attendance/cell-member-stats", icon: Radar },
    ],
  },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  { name: "Logout", href: "/logout", icon: ArrowLeftIcon },
]

const ZoneLeaderItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Fellowships", href: "/fellowships", icon: Church },
  { name: "Zones", href: "/zones", icon: Navigation },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  { name: "Logout", href: "/logout", icon: ArrowLeftIcon },
]

const FellowshipLeaderItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Fellowships", href: "/fellowships", icon: Church },
  { name: "Cells", href: "/cells", icon: Radar },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  { name: "Logout", href: "/auth", icon: ArrowLeftIcon },
]

const MemberItems = [{ name: "Logout", href: "/logout", icon: ArrowLeftIcon }]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { me, isLoading } = useAuthMemberStore() // Assuming isLoading is available.

  const role = me?.data?.role

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed left-4 top-4 z-50">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          {isLoading ? <LoadingSidebar /> : <SidebarContent pathname={pathname} role={role} />}
        </SheetContent>
      </Sheet>
      <aside className="hidden lg:flex h-screen w-[240px] flex-col fixed inset-y-0">
        {isLoading ? <LoadingSidebar /> : <SidebarContent pathname={pathname} role={role} />}
      </aside>
    </>
  )
}

// Type definition for menu items
type MenuItem = {
  name: string
  href?: string
  icon: React.ElementType
  subItems?: MenuItem[]
}

// New component for rendering menu items with potential submenus
function SidebarMenuItem({ item, pathname }: { item: MenuItem; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubItems = item.subItems && item.subItems.length > 0

  // Check if current path matches this item or any of its subitems
  const isActive =
    pathname === item.href || (hasSubItems && item.subItems?.some((subItem) => pathname === subItem.href))

  // Check if submenu should be open by default (when a subitem is active)
  React.useEffect(() => {
    if (hasSubItems && item.subItems?.some((subItem) => pathname === subItem.href)) {
      setIsOpen(true)
    }
  }, [pathname, hasSubItems, item.subItems])

  return (
    <div>
      {hasSubItems ? (
        // Parent item with submenu
        <div className="flex flex-col">
          <Button
            variant="ghost"
            className={cn("justify-between w-full", isActive && !item.href ? "text-purple-700" : "text-neutral-800")}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {/* Submenu items */}
          {isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1 border-l pl-2">
              {item.subItems?.map((subItem) => (
                <Button
                  key={subItem.name}
                  asChild
                  variant={pathname === subItem.href ? "destructive" : "ghost"}
                  className={cn("justify-start", pathname === subItem.href ? "text-purple-700" : "text-neutral-800")}
                >
                  <Link href={subItem.href || "#"}>
                    <subItem.icon className="mr-2 h-4 w-4" />
                    {subItem.name}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Regular menu item without submenu
        <Button
          asChild
          variant={pathname === item.href ? "destructive" : "ghost"}
          className={cn("justify-start", pathname === item.href ? "text-purple-700" : "text-neutral-800")}
        >
          <Link href={item.href || "#"}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
        </Button>
      )}
    </div>
  )
}

function SidebarContent({
  pathname,
  role,
}: {
  pathname: string
  role?: string
}) {
  const getSidebarItems = () => {
    switch (role) {
      case "ADMIN":
        return AdminItems
      case "CELL_LEADER":
        return CellLeaderItems
      case "ZONE_LEADER":
        return ZoneLeaderItems
      case "FELLOWSHIP_LEADER":
        return FellowshipLeaderItems
      case "MEMBER":
        return MemberItems
      default:
        return []
    }
  }

  const sidebarItems = getSidebarItems()

  if (!role) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>No role assigned. Please contact your administrator.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col border-r bg-neutral-100 text-black">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span>Mystic Martyrs</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.name} item={item} pathname={pathname} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

function LoadingSidebar() {
  return (
    <div className="flex h-full items-center justify-center">
      <p>Loading sidebar...</p>
    </div>
  )
}

