"use client"

import { generalCellStat } from "@/app/actions/attendance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore"
import { useAction } from "next-safe-action/hooks"
import { useEffect } from "react"

export function CellStats() {
  const { me } = useAuthMemberStore()
  const cell_id: string =
    me?.data.role === "CELL_LEADER" ? me?.data.member?.cell_id : ""

  const {
    execute: fetchCellStats,
    status: cellStatsLoading,
    result: cellData,
  } = useAction(generalCellStat)

  useEffect(() => {
    if (cell_id) {
      fetchCellStats({ cell_id })
    }
  }, [cell_id, fetchCellStats])

  if (cellStatsLoading === "executing" || !cellData?.data) {
    return <CellStatsSkeletonLoader />
  }

  const { totalDays, presentCount, attendancePercentage, totalMembers } =
    cellData.data.data

  const stats = [
    { title: "Total Days", value: totalDays },
    { title: "Present Count", value: presentCount },
    { title: "Overall Attendance Rate", value: `${attendancePercentage}%` },
    { title: "Total Members", value: totalMembers },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-neutral-100 shadow-lg border border-l">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CellStatsSkeletonLoader() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="bg-neutral-100 animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

