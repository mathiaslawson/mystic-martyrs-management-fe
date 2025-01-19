"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Menu,
  ArrowLeftIcon,
  Church,
  Radar,
  Navigation,
  UserRoundPlus,
} from "lucide-react";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";

const AdminItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Fellowships", href: "/fellowships", icon: Church },
  { name: "Zones", href: "/zones", icon: Navigation },
  { name: "Cells", href: "/cells", icon: Radar },
  { name: "Members", href: "/members", icon: Radar },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  { name: "Logout", href: "/logout", icon: ArrowLeftIcon },
];

const CellLeaderItems = [
  { name: "Home", href: "/home", icon: Home },
  {
    name: "Attendance Records",
    href: "/attendance/attendance-records",
    icon: Radar,
  },
  {
    name: "Cell Attendance Statistics",
    href: "/attendance/cell-member-stats",
    icon: Radar,
  },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  { name: "Logout", href: "/logout", icon: ArrowLeftIcon },
];

const ZoneLeaderItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Fellowships", href: "/fellowships", icon: Church },
  { name: "Zones", href: "/zones", icon: Navigation },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  { name: "Logout", href: "/logout", icon: ArrowLeftIcon },
];

const FellowshipLeaderItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Fellowships", href: "/fellowships", icon: Church },
  { name: "Cells", href: "/cells", icon: Radar },
  { name: "Invitations", href: "/invitation", icon: UserRoundPlus },
  { name: "Logout", href: "/logout", icon: ArrowLeftIcon },
];

const MemberItems = [{ name: "Logout", href: "/logout", icon: ArrowLeftIcon }];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { me, isLoading } = useAuthMemberStore(); // Assuming isLoading is available.

  const role = me?.data?.role;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed left-4 top-4 z-50"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          {isLoading ? (
            <LoadingSidebar />
          ) : (
            <SidebarContent pathname={pathname} role={role} />
          )}
        </SheetContent>
      </Sheet>
      <aside className="hidden lg:flex h-screen w-[240px] flex-col fixed inset-y-0">
        {isLoading ? (
          <LoadingSidebar />
        ) : (
          <SidebarContent pathname={pathname} role={role} />
        )}
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  role,
}: {
  pathname: string;
  role?: string;
}) {
  const getSidebarItems = () => {
    switch (role) {
      case "ADMIN":
        return AdminItems;
      case "CELL_LEADER":
        return CellLeaderItems;
      case "ZONE_LEADER":
        return ZoneLeaderItems;
      case "FELLOWSHIP_LEADER":
        return FellowshipLeaderItems;
      case "MEMBER":
        return MemberItems;
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();

  if (!role) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>No role assigned. Please contact your administrator.</p>
      </div>
    );
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
            <Button
              key={item.name}
              asChild
              variant={pathname === item.href ? "destructive" : "ghost"}
              className={`justify-start ${
                pathname === item.href ? "text-purple-700" : "text-neutral-800"
              }`}
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
  );
}

function LoadingSidebar() {
  return (
    <div className="flex h-full items-center justify-center">
      <p>Loading sidebar...</p>
    </div>
  );
}
