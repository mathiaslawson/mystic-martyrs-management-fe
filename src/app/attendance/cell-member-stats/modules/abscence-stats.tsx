import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceStatsProps {
  stats: {
    totalDays: number
    presentDays: number
    attendancePercentage: number
  } | null
}

export function AttendanceStats({ stats }: AttendanceStatsProps) {
  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-neutral-100 shadow-lg  border border-l">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDays}</div>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 shadow-lg  border border-l">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.presentDays}</div>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 shadow-lg  border border-l">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Abscent Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDays - stats.presentDays}</div>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 shadow-lg  border border-l">
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

