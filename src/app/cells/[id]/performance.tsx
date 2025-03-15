"use client"

import { useAction } from "next-safe-action/hooks"
import { useEffect, useState } from "react"
import { getFullCellPerformanceMetrics } from "@/components/@Global/actions/cells/performance"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Users, UserCheck, UserX, GraduationCap, Loader } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { MetricsData } from "@/app/performance/@types"
import { CellData } from "../@types"


function CellPerformanceAnalytics({cellData } : {cellData : CellData}) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date("2024-01-24"))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date("2025-06-24"))
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const {
    execute: getFullCellPerformance,
    result: fullCellPerformanceResult,
    status,
  } = useAction(getFullCellPerformanceMetrics)

  useEffect(() => {

    if (startDate && endDate) {
      getFullCellPerformance({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        cell_id: cellData.cell.cell_id
      })
    }
  }, [startDate, endDate, getFullCellPerformance, cellData.cell.cell_id])

  const performanceData: MetricsData = fullCellPerformanceResult?.data?.data
  // Helper function to round to 1 decimal place
  const roundToOneDecimal = (value: number) => {
    return Math.round(value * 10) / 10
  }

  // Colors for charts
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"]

  // Prepare data for attendance chart
  const attendanceChartData = performanceData?.attendance.attendanceByDate.map((item) => ({
    date: format(new Date(item.date), "MMM dd, yyyy"),
    attendance: roundToOneDecimal(item.attendancePercentage),
  }))

  // Prepare data for exam performance pie chart
  const examDistributionData = performanceData?.examPerformance.examDetails.map((exam) => {
    const { scoreBrackets } = exam
    return [
      { name: "Excellent", value: scoreBrackets.excellent },
      { name: "Good", value: scoreBrackets.good },
      { name: "Average", value: scoreBrackets.average },
      { name: "Below Average", value: scoreBrackets.belowAverage },
    ]
  })[0]

  // Prepare data for performance distribution
  const performanceDistributionData = performanceData?.performanceDistribution.distribution
    ? [
        { name: "Excellent", value: performanceData.performanceDistribution.distribution.excellent },
        { name: "Very Good", value: performanceData.performanceDistribution.distribution.veryGood },
        { name: "Good", value: performanceData.performanceDistribution.distribution.good },
        { name: "Satisfactory", value: performanceData.performanceDistribution.distribution.satisfactory },
        { name: "Needs Improvement", value: performanceData.performanceDistribution.distribution.needsImprovement },
      ]
    : []

  return (
    <div className="xl:mt-[-1.6rem] mt-10">
      <div className="flex flex-col space-y-6">
     
        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date Range</CardTitle>
            <CardDescription>Choose a time period to analyze performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover open={startOpen} onOpenChange={setStartOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date)
                        setStartOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover open={endOpen} onOpenChange={setEndOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date)
                        setEndOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    if (startDate && endDate) {
                      getFullCellPerformance({
                        start_date: startDate.toISOString(),
                        end_date: endDate.toISOString(),
                      })
                    }
                  }}
                  disabled={status === "executing"}
                  className="w-full sm:w-auto"
                >
                  {status === "executing" ? "Loading..." : "Apply"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {status === "executing" ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin"/>
          </div>
        ) : performanceData ? (
          <>
            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="exams">Exam Performance</TabsTrigger>
                <TabsTrigger value="distribution">Performance Distribution</TabsTrigger>
                <TabsTrigger value="growth">Growth & History</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{performanceData.totalMembers}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{performanceData.activeMembers}</div>
                      <p className="text-xs text-muted-foreground">
                        {roundToOneDecimal((performanceData.activeMembers / performanceData.totalMembers) * 100)}% of
                        total
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Inactive Members</CardTitle>
                      <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{performanceData.inactiveMembers}</div>
                      <p className="text-xs text-muted-foreground">
                        {roundToOneDecimal((performanceData.inactiveMembers / performanceData.totalMembers) * 100)}% of
                        total
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Overview</CardTitle>
                      <CardDescription>Average attendance and session data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Average Attendance:</span>
                          <span className="font-bold">
                            {roundToOneDecimal(performanceData.attendance.averageAttendance)}%
                          </span>
                        </div>
                        <Progress value={performanceData.attendance.averageAttendance} className="h-2" />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Sessions</p>
                            <p className="text-xl font-bold">{performanceData.attendance.totalSessions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Present</p>
                            <p className="text-xl font-bold">{performanceData.attendance.totalPresent}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Exam Performance Overview</CardTitle>
                      <CardDescription>Average scores and participation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Average Score:</span>
                          <span className="font-bold">
                            {roundToOneDecimal(performanceData.examPerformance.overallAverageScore)}%
                          </span>
                        </div>
                        <Progress value={performanceData.examPerformance.overallAverageScore} className="h-2" />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Exams</p>
                            <p className="text-xl font-bold">{performanceData.examPerformance.totalExams}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Avg. Participation</p>
                            <p className="text-xl font-bold">
                              {roundToOneDecimal(performanceData.examPerformance.averageParticipationRate)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Metrics</CardTitle>
                    <CardDescription>Detailed attendance data over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis label={{ value: "Attendance (%)", angle: -90, position: "insideLeft" }} />
                          <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                          <Legend />
                          <Bar dataKey="attendance" name="Attendance %" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance by Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Attendance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {performanceData.attendance.attendanceByDate.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{format(new Date(item.date), "MMM dd, yyyy")}</TableCell>
                            <TableCell>{item.totalPresent}</TableCell>
                            <TableCell>{roundToOneDecimal(item.attendancePercentage)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Exam Performance Tab */}
              <TabsContent value="exams" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{performanceData.examPerformance.totalExams}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {roundToOneDecimal(performanceData.examPerformance.overallAverageScore)}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Participation Rate</CardTitle>
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {roundToOneDecimal(performanceData.examPerformance.averageParticipationRate)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Exam Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead>Participation %</TableHead>
                          <TableHead>Avg. Score</TableHead>
                          <TableHead>Score Distribution</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {performanceData.examPerformance.examDetails.map((exam) => (
                          <TableRow key={exam.examId}>
                            <TableCell className="font-medium">{exam.title}</TableCell>
                            <TableCell>{format(new Date(exam.date), "MMM dd, yyyy")}</TableCell>
                            <TableCell>{exam.totalParticipants}</TableCell>
                            <TableCell>{roundToOneDecimal(exam.participationRate)}%</TableCell>
                            <TableCell>{roundToOneDecimal(exam.averageScore)}%</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                <span className="text-xs">{exam.scoreBrackets.excellent} Excellent</span>
                                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                                <span className="text-xs">{exam.scoreBrackets.good} Good</span>
                                <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                                <span className="text-xs">{exam.scoreBrackets.average} Average</span>
                                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                                <span className="text-xs">{exam.scoreBrackets.belowAverage} Below Avg</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                    <CardDescription>Overall distribution of exam scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={examDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {examDistributionData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, "Students"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Distribution Tab */}
              <TabsContent value="distribution" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Appraisals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {performanceData.performanceDistribution.totalAppraisals}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {roundToOneDecimal(performanceData.performanceDistribution.averageScores.overall)}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Exam Average</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {roundToOneDecimal(performanceData.performanceDistribution.averageScores.exams)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Distribution</CardTitle>
                    <CardDescription>Distribution of performance ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={performanceDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {performanceDistributionData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, "Members"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Scores Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Overall</span>
                          <span>
                            {roundToOneDecimal(performanceData.performanceDistribution.averageScores.overall)}%
                          </span>
                        </div>
                        <Progress
                          value={performanceData.performanceDistribution.averageScores.overall}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Attendance</span>
                          <span>
                            {roundToOneDecimal(performanceData.performanceDistribution.averageScores.attendance)}%
                          </span>
                        </div>
                        <Progress
                          value={performanceData.performanceDistribution.averageScores.attendance}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Exams</span>
                          <span>{roundToOneDecimal(performanceData.performanceDistribution.averageScores.exams)}%</span>
                        </div>
                        <Progress value={performanceData.performanceDistribution.averageScores.exams} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Growth & History Tab */}
              <TabsContent value="growth" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Membership Growth</CardTitle>
                      <CardDescription>Changes in membership over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Joined</p>
                          <p className="text-2xl font-bold">{performanceData.growthMetrics.membershipGrowth.joined}</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Left</p>
                          <p className="text-2xl font-bold">{performanceData.growthMetrics.membershipGrowth.left}</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Net Growth</p>
                          <p className="text-2xl font-bold">
                            {performanceData.growthMetrics.membershipGrowth.netGrowth}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Growth</CardTitle>
                      <CardDescription>Changes in member performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Average Growth</p>
                          <p className="text-2xl font-bold">
                            {roundToOneDecimal(performanceData.growthMetrics.performanceGrowth.averageGrowth)}%
                          </p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Members Improved</p>
                          <p className="text-2xl font-bold">
                            {performanceData.growthMetrics.performanceGrowth.membersImproved}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Members Declined</p>
                          <p className="text-2xl font-bold">
                            {performanceData.growthMetrics.performanceGrowth.membersDeclined}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Members Steady</p>
                          <p className="text-2xl font-bold">
                            {performanceData.growthMetrics.performanceGrowth.membersSteady}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
{/* for later */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Cell History</CardTitle>
                    <CardDescription>Historical division events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Division Date</TableHead>
                          <TableHead>Parent Cell ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {performanceData.cellHistory.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{format(new Date(item.division_date), "MMM dd, yyyy")}</TableCell>
                            <TableCell>{item.parent_cell_id}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card> */}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="p-8 text-center">
            <p>Select a date range and click Apply to view performance analytics</p>
          </Card>
        )}
      </div>
    </div>

   
  )
}

export default (CellPerformanceAnalytics)

