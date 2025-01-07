"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AttendanceStats } from "./abscence-stats"
import { AbsenceList } from "./abscence-list"

interface MemberStatsDialogProps {
  memberId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberStatsDialog({ memberId, open, onOpenChange }: MemberStatsDialogProps) {
  // Mock data - in a real application, you'd fetch this based on the memberId
  const memberStats = {
    totalDays: 30,
    presentDays: 28,
    attendancePercentage: 93.33
  }

  const absences = [
    {
      date: "2024-11-23T15:30:00.000Z",
      remarks: "Recorded"
    },
    {
      date: "2024-11-10T15:30:00.000Z",
      remarks: "Recorded"
    }
  ]

  console.log(memberId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Member Statistics</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <AttendanceStats stats={memberStats} />
          <AbsenceList absences={absences} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

