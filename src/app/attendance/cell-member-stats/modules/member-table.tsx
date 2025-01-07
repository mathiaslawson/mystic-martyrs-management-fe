"use client";

import { useState } from "react";
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

// Mock data for demonstration
const members = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
];

export function MemberTable() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  return (
    <>
      <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
        <CardHeader className="bg-green-100 text-black rounded-t-lg">
          <CardTitle>Cell Members</CardTitle>
          <CardDescription className="text-green-900">
            Members on the [cell_name] cell
          </CardDescription>
          <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedMember(member.id)}
                    >
                      View Stats
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MemberStatsDialog
        memberId={selectedMember}
        open={selectedMember !== null}
        onOpenChange={() => setSelectedMember(null)}
      />
    </>
  );
}
