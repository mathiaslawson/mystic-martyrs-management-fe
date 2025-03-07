"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MemberStatsDialog } from "./member-stat-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";
import { useAction } from "next-safe-action/hooks";
import { getCellMembers } from "@/components/@Global/actions/attendance";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Skeleton } from "@/components/ui/skeleton";

export function MemberTable() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // TODO: extract id from me and call acition
  const { me } = useAuthMemberStore();
  const cell_id: string | "" =
    me?.data.role === "CELL_LEADER" ? me?.data.member?.cell_id : " ";

  // TODO: call member action here.
  const {
    execute: getMembers,
    status: membersLoading,
    result: membersResult,
  } = useAction(getCellMembers);

  console.log(cell_id);

  useEffect(() => {
    getMembers({
      cell_id: cell_id,
    });
  }, [getMembers, cell_id]);

  if (membersLoading === "executing") {
    return (
      <>
        <Card className="bg-neutral-100 animate-pulse h-[100px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className=" w-[100px] h-13" />
          </CardHeader>
        </Card>
      </>
    );
  }

  return (
    <>
      {(membersLoading && membersResult) && (
        <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
          <CardHeader className="bg-green-100 text-black rounded-t-lg">
            <CardTitle>Cell Attendace Statistics</CardTitle>
            <CardDescription className="text-green-900">
              Members on the {membersResult?.data?.data?.cell_name}
            </CardDescription>
            <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
          </CardHeader>
          <CardContent>
            {membersLoading  && (
              <>
                <Table className="transition-all">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membersResult?.data?.data?.members?.map(
                      (member: {
                        member_id: string;
                        firstname: string;
                        lastname: string;
                        email: string;
                        role: string;
                      }) => (
                        <TableRow key={member.member_id}>
                          <TableCell>
                            <div className="flex items-center space-x-4 mb-4">
                              <Avatar className="h-16 w-16 rounded-full">
                                <AvatarImage
                                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${member?.firstname} ${member?.lastname}`}
                                />
                                <AvatarFallback>
                                  {member?.firstname}
                                  {member?.lastname}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-lg">
                                  {member?.firstname} {member?.lastname}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {member?.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              onClick={() =>
                                setSelectedMember(member.member_id)
                              }
                            >
                              View Performance
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      )}
      <MemberStatsDialog
        memberId={selectedMember}
        open={selectedMember !== null}
        onOpenChange={() => setSelectedMember(null)}
      />
    </>
  );
}
