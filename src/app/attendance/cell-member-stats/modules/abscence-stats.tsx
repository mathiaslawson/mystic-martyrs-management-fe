import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceStatsProps {
  stats: {
    totalDays: number
    presentDays: number
    attendancePercentage: number
  }
}

export function AttendanceStats({ stats }: AttendanceStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDays}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.presentDays}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.attendancePercentage.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </div>
  )
}

