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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, filterByWeek, filterByMonth } from "@/lib/utils";

const attendanceRecords = [
  {
    attendance_id: "973a5740-74f9-4dce-a40f-695f409f5947",
    member_id: "d4e1b7bf-7f37-4996-9de7-660f6f540ab9",
    cell_id: "00e23fa1-12c8-439d-a2e4-f5b1300f4b64",
    date: "2024-11-23T15:30:00.000Z",
    is_present: false,
    remarks: "Recorded",
    member: {
      firstname: "Mathias",
      lastname: "Lawson",
    },
    cell: {
      cell_name: "Central Miotso Cell",
    },
  },
  {
    attendance_id: "5822f30e-cc55-4692-9fde-2d2443f8bc02",
    member_id: "2",
    cell_id: "00e23fa1-12c8-439d-a2e4-f5b1300f4b64",
    date: "2025-01-26T15:30:00.000Z",
    is_present: true,
    remarks: "Recorded",
    member: {
      firstname: "Jane",
      lastname: "Doe",
    },
    cell: {
      cell_name: "Central Miotso Cell",
    },
  },
  {
    attendance_id: "f11d79ab-efc0-4355-93f6-48d132d55e77",
    member_id: "3",
    cell_id: "00e23fa1-12c8-439d-a2e4-f5b1300f4b64",
    date: "2024-11-27T15:30:00.000Z",
    is_present: true,
    remarks: "Recorded",
    member: {
      firstname: "John",
      lastname: "Smith",
    },
    cell: {
      cell_name: "Central Miotso Cell",
    },
  },
];

type FilterType = "all" | "week" | "month";

export function AttendanceTable() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = attendanceRecords.filter((record) =>
    `${record.member.firstname} ${record.member.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getFilteredRecords = () => {
    switch (filter) {
      case "week":
        return filterByWeek(new Date(), filteredRecords);
      case "month":
        return filterByMonth(new Date(), filteredRecords);
      default:
        return filteredRecords;
    }
  };

  const records = getFilteredRecords();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "week" ? "default" : "outline"}
            onClick={() => setFilter("week")}
          >
            This Week
          </Button>
          <Button
            variant={filter === "month" ? "default" : "outline"}
            onClick={() => setFilter("month")}
          >
            This Month
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member Name</TableHead>
              <TableHead>Cell Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.attendance_id}>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>{`${record.member.firstname} ${record.member.lastname}`}</TableCell>
                <TableCell>{record.cell.cell_name}</TableCell>
                <TableCell>
                  <Badge variant={record.is_present ? "default" : "secondary"}>
                    {record.is_present ? "Present" : "Absent"}
                  </Badge>
                </TableCell>
                <TableCell>{record.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {records.length === 0 && (
        <p className="text-center text-muted-foreground">No records found.</p>
      )}
    </div>
  );
}
