import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const cellData = {
  totalDays: 1,
  presentCount: 1,
  attendancePercentage: 50,
  totalMembers: 2
}

export function CellStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-neutral-100 shadow-lg  border border-l">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cellData.totalDays}</div>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 shadow-lg  border border-l">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cellData.presentCount}</div>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 shadow-lg  border border-l">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cellData.attendancePercentage}%</div>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 shadow-lg  border border-l">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cellData.totalMembers}</div>
        </CardContent>
      </Card>
    </div>
  )
}

