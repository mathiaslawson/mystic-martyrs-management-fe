"use client";

import { withAuth } from "@/components/hoc/withAuth";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import Image from "next/image";
// import TransferModal from "@/app/members/TransferModal";

// import {  Loader, Mail, RocketIcon, User } from "lucide-react"
import { Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAllMembersAction } from "../../components/@Global/actions/auth";
import LayoutContent from "../LayoutContent";

function Home() {
  const {
    execute: getMembers,
    result: members,
    status,
  } = useAction(getAllMembersAction);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  if (members) {
    console.log(members);
  }

  return (
    <LayoutContent>
      <div className="xl:mt-[-1.6rem] mt-10">
        <div className="flex flex-col">
          <div className="flex h-5 items-center space-x-4 text-sm"></div>
          {/* Notify */}
          <div className="border-purple-600 mt-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-md p-4 shadow-lg">
            <div className="flex items-center justify-between h-[15svh]">
              <div className="flex items-center space-x-4 text-purple-200">
                <div>
                  <h2 className="text-3xl font-bold text-white">Members</h2>
                </div>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/images/menorah.png"
                  alt="Notification illustration"
                  width={200}
                  height={200}
                  className="rounded-full bg-transparent p-2"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                />
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="w-full mt-10">
            {status === "executing" ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <Loader className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : members && members.data ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      {/* <TableHead>Zone</TableHead>
                      <TableHead>Fellowship</TableHead> */}
                      <TableHead>Cell</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.data?.data?.map(
                      (cell_member: {
                        firstname: string;
                        lastname: string;
                        email: string;
                        role: string;
                        zone: string;
                        fellowship: string;
                        cell: {
                          cell_name: string;
                        };
                        member_id: string;
                      }) => (
                        <TableRow key={cell_member.email}>
                          <TableCell>{`${cell_member.firstname} ${cell_member.lastname}`}</TableCell>
                          <TableCell>{cell_member.email}</TableCell>
                          <TableCell>{cell_member.role}</TableCell>
                          {/* <TableCell>{cell_member.zone}</TableCell>
                          <TableCell>{cell_member.fellowship} </TableCell> */}
                          <TableCell>{cell_member?.cell?.cell_name}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No fellowships found. Try refreshing the page.
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutContent>
  );
}

export default withAuth(Home);
