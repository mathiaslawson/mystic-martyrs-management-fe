'use client'

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader, RefreshCw } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDate, filterByWeek, filterByMonth } from "@/lib/utils"
import { attendanceRecords } from "@/components/@Global/actions/attendance"
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore"

type FilterType = "all" | "week" | "month"

type AttendanceRecord = {
  attendance_id: string
  member_id: string
  cell_id: string
  date: string
  is_present: boolean
  remarks: string
  member: {
    firstname: string
    lastname: string
  }
  cell: {
    cell_name: string
  }
}

export function AttendanceTable() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { me } = useAuthMemberStore()
  const cell_id: string = me?.data.role === "CELL_LEADER" ? me?.data.member?.cell_id : ""

  const fetchAttendanceRecords = async (showToast = false) => {
    try {
      if (!cell_id) {
        throw new Error("No cell ID available")
      }

      setIsRefreshing(showToast)
      const fetchedRecords = await attendanceRecords({ cell_id: cell_id })
      setRecords(fetchedRecords?.data.data)
      
      if (showToast) {
        toast.success("Data refreshed successfully")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch attendance records")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAttendanceRecords()
  }, [cell_id])

  const filteredRecords = records?.filter((record) =>
    `${record.member.firstname} ${record.member.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const getFilteredRecords = () => {
    switch (filter) {
      case "week":
        return filterByWeek(new Date(), filteredRecords)
      case "month":
        return filterByMonth(new Date(), filteredRecords)
      default:
        return filteredRecords
    }
  }

  const displayRecords = getFilteredRecords()

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading attendance records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchAttendanceRecords(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
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
            {displayRecords.map((record) => (
              <TableRow key={record.attendance_id}>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>{`${record.member.firstname} ${record.member.lastname}`}</TableCell>
                <TableCell>{record.cell.cell_name}</TableCell>
                <TableCell>
                  <Badge variant={record.is_present ? "default" : "secondary"} className={`${record.is_present ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                    {record.is_present ? "Present" : "Absent"}
                  </Badge>
                </TableCell>
                <TableCell>{record.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {displayRecords.length === 0 && (
        <p className="text-center text-muted-foreground">No records found.</p>
      )}
    </div>
  )
}