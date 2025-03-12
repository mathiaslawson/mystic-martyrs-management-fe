"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  MoreHorizontal,
  ArrowRightLeft,
  History,
  UserMinus,
  Loader2,
} from "lucide-react";

import type { CellData, Member } from "../../@types";
import { TransferMemberDialog } from "../dialogs/members-dialogs/transfer-member-dialog";
import { ChangeStatusDialog } from "../dialogs/members-dialogs/change-status-dialog";
import { TransferHistoryDialog } from "../dialogs/members-dialogs/transfer-history-dialog";

export default function CellMembersCard({ cellData, refreshData }: { cellData: CellData, refreshData: ()=>void }) {
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingMemberId] = useState<string | null>(null);
  const [operationType] = useState<string | null>(null);

  
  useEffect(() => {
    if (!transferDialogOpen && !statusDialogOpen && !historyDialogOpen) {
      const timeout = setTimeout(() => {
        setSelectedMember(null);
      }, 300); 

      return () => clearTimeout(timeout);
    }
  }, [transferDialogOpen, statusDialogOpen, historyDialogOpen]);



  const handleDropdownItemClick = (
    action: string,
    member: Member,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedMember(member);
   
    if (action === "transfer") {
      setTransferDialogOpen(true);
    } else if (action === "status") {
      setStatusDialogOpen(true);
    } else if (action === "history") {
      setHistoryDialogOpen(true);
    }

  
    setDropdownOpen(false);
  };

  return (
    <>
      <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
        <CardHeader className="bg-green-100 text-black rounded-t-lg">
          <CardTitle>Cell Members</CardTitle>
          <CardDescription className="text-green-900">
            Members within this cell
          </CardDescription>
          <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cellData?.cell?.members?.map((member: Member) => (
                <TableRow 
                  key={member.member_id}
                  className={loadingMemberId === member.member_id ? "bg-green-50 animate-pulse" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.firstname} ${member.lastname}`}
                        />
                        <AvatarFallback>
                          {member.firstname}
                          {member.lastname}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-lg">
                          {member.firstname} {member.lastname}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-md"
                    >
                      {member.role === "CELL_LEADER"
                        ? "CELL LEADER"
                        : member.role === "FELLOWSHIP_LEADER"
                        ? "FELLOWSHIP LEADER"
                        : member.role === "ZONE_LEADER"
                        ? "ZONE LEADER"
                        : member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 rounded-md ${
                        member.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : member.status === "INACTIVE"
                          ? "bg-amber-100 text-amber-800"
                          : member.status === "TRANSFERRED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(member.created_at)}</TableCell>
                  <TableCell className="text-right">
                    {loadingMemberId === member.member_id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                        <span className="text-xs text-green-600">
                          {operationType === "transfer" ? "Transferring..." : 
                           operationType === "status" ? "Updating status..." : 
                           "Processing..."}
                        </span>
                      </div>
                    ) : (
                      <DropdownMenu
                        open={dropdownOpen && selectedMember?.member_id === member.member_id}
                        onOpenChange={(open) => {
                          setDropdownOpen(open);
                          if (open) setSelectedMember(member);
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleDropdownItemClick("transfer", member, e)
                            }
                            className="cursor-pointer"
                          >
                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                            Transfer Member
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleDropdownItemClick("status", member, e)
                            }
                            className="cursor-pointer"
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleDropdownItemClick("history", member, e)
                            }
                            className="cursor-pointer"
                          >
                            <History className="mr-2 h-4 w-4" />
                            View Transfer History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-center text-neutral-500 mt-10 text-sm">
            {cellData?.cell?.members?.length === 0 && "No Cell Members"}
          </div>
        </CardContent>
      </Card>

      {/* Transfer Member Dialog */}
      <TransferMemberDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        selectedMember={selectedMember}
        onSuccess={refreshData}
        
      />

      {/* Change Status Dialog */}
      <ChangeStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        selectedMember={selectedMember}
        refreshData={refreshData}
      />

      {/* Transfer History Dialog */}
      <TransferHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        selectedMember={selectedMember}
      />
    </>
  );
}