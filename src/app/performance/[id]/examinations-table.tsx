"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Edit,
  Loader,
  RefreshCw,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAction } from "next-safe-action/hooks"
import { deleteZone, updateZone } from "@/components/@Global/actions/zones"
import { withAuth } from "@/components/hoc/withAuth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getExamResultsDashboard, recordUpdateExamsResult } from "@/components/@Global/actions/cells/examinations"
import { formatDate } from "@/lib/utils"
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExamDetailTypes } from "../@types"

type MemberStatus = {
  member_id: string
  name: string
  email: string
  result_status: {
    status: string
    score: string
    recorded_at: string
    remarks: string
  }
}

const ExamDetail = ({
  data,
}: {
  data: {
    id: string
    recorded_results: number
    pending_results: number
    total_members: number
    cell_name: string
    title: string
    date: string
    member_statuses: {
      member_id: string
      name: string
      email: string
      result_status: {
        status: string
        score: string
        recorded_at: string
      }
    }[]
  }
}) => {
  const router = useRouter()

  const { execute: getDetails, result: details, isExecuting: isLoadingDetails } = useAction(getExamResultsDashboard)
  const { execute: updateDetails, isExecuting: isUpdating, result: updateResult } = useAction(updateZone)
  const { execute: deleteDetails, isExecuting: isDeleting, result: deleteResult } = useAction(deleteZone)

  const {
    execute: recordExams,
    status: recordExamsResult,
    isExecuting: recordExamsIsExecuting,
  } = useAction(recordUpdateExamsResult)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editData, setEditData] = useState({
    zone_name: "",
    zone_leader_id: "",
    zone_location: "",
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedMember, setSelectedMember] = useState<MemberStatus>({
    member_id: "",
    name: "",
    email: "",
    result_status: {
      status: "",
      score: "",
      recorded_at: "",
      remarks: "",
    },
  })
  const [open, setOpen] = useState(false)

  const { me } = useAuthMemberStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredMembers, setFilteredMembers] = useState<MemberStatus[]>([])
  const exportRef = useRef<HTMLDivElement>(null)

  function handleSubmit(formData: FormData) {
    try {
      const scoreValue = formData.get("score") as string
      const remarksValue = formData.get("remarks") as string

      recordExams({
        exam_id: data?.id,
        member_id: selectedMember.member_id ?? "",
        score: scoreValue ? Number(scoreValue) : 0,
        remarks: remarksValue || "",
        recorded_by: me?.data.member.member_id as string,
      })
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while recording the exam result")
    }
  }
  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    getDetails({ exam_id: data?.id })
    setIsRefreshing(false)
  }, [data?.id, getDetails])

  useEffect(() => {
    getDetails({ exam_id: data?.id })
  }, [getDetails, data?.id])

  useEffect(() => {
    if (updateResult?.data?.statusCode === 409 || updateResult?.data?.statusCode === 500) {
      toast.error(updateResult.data.message)
      setIsEditOpen(false)
    }
    console.log(updateResult?.data?.success, "are you success")
    if (updateResult?.data?.success === true) {
      refreshData()
      toast.success("Zone Updated Successfully")
      setIsEditOpen(false)
    }
  }, [updateResult, data?.id, refreshData])

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateDetails({
      id: details?.data?.data?.id,
      zone_name: editData.zone_name || details?.data?.data?.zone_name,
      zone_location: editData.zone_location || details?.data?.data?.zone_location,
    })
  }

  const handleDeleteConfirm = () => {
    deleteDetails({ id: details?.data?.data?.id })
    console.log("Delete confirmed for zone:", data.id)
  }

  useEffect(() => {
    if (deleteResult?.data?.statusCode === 404) {
      toast.error(deleteResult.data.message)
      setIsDeleteOpen(false)
    }
    console.log(deleteResult?.data?.success, "are you success")
    if (deleteResult?.data?.success === true) {
      setIsDeleteOpen(false)
      toast.success("Zone Deleted Successfully")
      router.push("/zones")
    }
  }, [deleteResult, data?.id, router])

  useEffect(() => {
    if (recordExamsResult === "hasSucceeded") {
      toast.success("Exam result recorded successfully")
      refreshData()
      setOpen(false)
    } else if (recordExamsResult === "hasErrored") {
      toast.error("Failed to record exam result")
    }
  }, [recordExamsResult, refreshData])

  const [examData, setExamData] = useState(details?.data?.data)

  useEffect(() => {
    setExamData(details?.data?.data)
  }, [details?.data?.data])

  useEffect(() => {
    if (!examData?.member_statuses) return

    const filtered = examData.member_statuses.filter(
      (member: MemberStatus) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.result_status.remarks && member.result_status.remarks.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    setFilteredMembers(filtered)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm, examData?.member_statuses])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)

  const handleExport = (data: ExamDetailTypes) => {
    if (!data) return

    // Create a blob with the HTML content
    const logoUrl = "https://0hzedy78ny.ufs.sh/f/0God9jbpNRGfTZk6IcgNS4R2z6fdOlAams0cQpTJCr9ZeBLt"

    const htmlContent = `
     <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exam Results - ${data.title}</title>
  <style>
    :root {
      --primary: #7f35fd;
      --primary-light: #eef2ff;
      --success: #2ecc71;
      --warning: #f39c12;
      --danger: #e74c3c;
      --gray-100: #f8f9fa;
      --gray-200: #e9ecef;
      --gray-300: #dee2e6;
      --gray-600: #6c757d;
      --gray-800: #343a40;
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      --radius: 8px;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: var(--gray-800);
      background-color: #fff;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .container {
      background-color: white;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 2rem;
    }
    
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--gray-200);
    }
    
    .logo {
      width: 100px;
      height: auto;
      margin-right: 1.5rem;
      object-fit: contain;
    }
    
    .title {
      margin: 0;
      color: var(--primary);
      font-size: 1.8rem;
      font-weight: 600;
    }
    
    .subtitle {
      font-size: 1rem;
      color: var(--gray-600);
      margin-top: 0.5rem;
    }
    
    .date {
      color: var(--gray-600);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    
    .stat-card {
      background-color: white;
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow);
      transition: transform 0.2s ease;
      border-top: 4px solid var(--primary);
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
    }
    
    .stat-title {
      font-size: 0.9rem;
      color: var(--gray-600);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.75rem;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
    }
    
    .table-container {
      overflow-x: auto;
      margin: 2rem 0;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
    }
    
    th, td {
      padding: 1rem;
      text-align: left;
    }
    
    th {
      background-color: var(--primary-light);
      color: var(--primary);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }
    
    tr:nth-child(even) {
      background-color: var(--gray-100);
    }
    
    tr:hover {
      background-color: var(--primary-light);
    }
    
    td {
      border-bottom: 1px solid var(--gray-200);
    }
    
    .status {
      padding: 0.35rem 0.75rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 500;
      display: inline-block;
    }
    
    .status-passed {
      background-color: rgba(46, 204, 113, 0.15);
      color: var(--success);
    }
    
    .status-failed {
      background-color: rgba(231, 76, 60, 0.15);
      color: var(--danger);
    }
    
    .status-pending {
      background-color: rgba(243, 156, 18, 0.15);
      color: var(--warning);
    }
    
    .btn {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(67, 97, 238, 0.3);
    }
    
    .btn:hover {
      background-color: #3050e0;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(67, 97, 238, 0.4);
    }
    
    .btn-icon {
      margin-right: 0.5rem;
    }
    
    .footer {
      margin-top: 2rem;
      text-align: center;
      color: var(--gray-600);
      font-size: 0.9rem;
    }
    
    @media print {
      .no-print {
        display: none;
      }
      
      body {
        padding: 0;
      }
      
      .container {
        box-shadow: none;
        padding: 0;
      }
      
      .stat-card {
        box-shadow: none;
        border: 1px solid var(--gray-300);
      }
      
      .table-container {
        box-shadow: none;
      }
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        text-align: center;
      }
      
      .logo {
        margin-right: 0;
        margin-bottom: 1rem;
      }
      
      .stats {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="Logo" class="logo" />
      <div>
        <h1 class="title">${data.title}</h1>
        <p class="subtitle">Examination Results Summary</p>
        <p class="date">Generated on: ${formatDate(data.date)}</p>
      </div>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-title">Total Members</div>
        <div class="stat-value">${data.total_members}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Recorded Results</div>
        <div class="stat-value">${data.recorded_results}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Pending Results</div>
        <div class="stat-value">${data.pending_results}</div>
      </div>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Score</th>
            <th>Remarks</th>
            <th>Recorded At</th>
          </tr>
        </thead>
        <tbody>
          ${data.member_statuses
            .map(
              (member) => `
            <tr>
              <td>${member.name}</td>
              <td>${member.email}</td>
              <td>
                <span class="status">
                  ${member.result_status.status}
                </span>
              </td>
              <td>${member.result_status.score !== null ? `${member.result_status.score}%` : "-"}</td>
              <td>${member.result_status.remarks ?? "-"}</td>
              <td>${formatDate(member.result_status.recorded_at)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    
    <div class="no-print" style="text-align: center;">
      <button class="btn" onclick="window.print()">
        <span class="btn-icon">📄</span> Print Results
      </button>
    </div>
    
    <div class="footer no-print">
      <p>© ${new Date().getFullYear()} ${data.title}. All rights reserved.</p>
    </div>
  </div>

  <script>
    // Helper function to determine status class
    function getStatusClass(status) {
      status = status.toLowerCase();
      if (status.includes('pass')) return 'status-passed';
      if (status.includes('fail')) return 'status-failed';
      return 'status-pending';
    }
  </script>
</body>
</html>
    `

    // Create a blob and URL for the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" })
    const blobUrl = URL.createObjectURL(blob)

    // Open the blob URL in a new window
    const printWindow = window.open(blobUrl)

    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups for this site.")
      return
    }

    // Clean up the blob URL when the window is closed
    printWindow.onafterprint = () => {
      URL.revokeObjectURL(blobUrl)
    }
  }

  if (isLoadingDetails) {
    return (
      <div className="col-span-full flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-neutral-600" />
      </div>
    )
  }

  if (!examData) {
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen xl:mt-[-0.5rem] mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/examinations">
            <Button variant="outline" className="bg-neutral-800 text-white hover:bg-neutral-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Examinations
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Button onClick={refreshData} disabled={isRefreshing} className="text-black">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button className="text-black mr-2">
                  <Edit className="mr-2 h-4" /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Zone</DialogTitle>
                  <DialogDescription>
                    Make changes to the zone here. Click save when you&rsquo;re done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="zone_name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="zone_name"
                        value={editData.zone_name || examData.title}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            zone_name: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="zone_location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="zone_location"
                        value={editData.zone_location || examData.title}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            zone_location: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      variant="outline"
                      className="bg-neutral-800 text-white hover:bg-neutral-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                {/* <Button className="text-black">
                  <Trash2 className="mr-2 h-4" /> Delete
                </Button> */}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this zone?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the zone and all associated data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="outline"
                    className="bg-neutral-800 text-white hover:bg-neutral-700"
                    disabled={isDeleting}
                    onClick={handleDeleteConfirm}
                  >
                    {isDeleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="container mx-auto py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{examData.title}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{formatDate(examData.date)}</span>
              </div>
              {/* <div className="text-muted-foreground mt-1">
                <span className="font-medium">{examData.cell_name}</span>
              </div> */}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => handleExport(examData)} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Results
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{examData.total_members}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recorded Results</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{examData.recorded_results}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Results</CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{examData.pending_results}</div>
              </CardContent>
            </Card>
          </div>

          {/* Member Status Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Member Results</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search members..."
                    className="w-[250px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="10 per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Recorded At</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((member: MemberStatus) => (
                      <TableRow key={member.member_id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${member.result_status.status === "RECORDED" ? "bg-green-300 text-green-900" : "bg-yellow-300 text-yellow-900"}`}
                          >
                            {member.result_status.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.result_status.score !== null ? `${member.result_status.score}%` : "-"}
                        </TableCell>
                        <TableCell>{member.result_status.remarks ?? "-"}</TableCell>
                        <TableCell>{formatDate(member.result_status.recorded_at)}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              setOpen(true)
                              setSelectedMember(member)
                            }}
                            variant={member.result_status.status === "RECORDED" ? "outline" : "default"}
                            size="sm"
                          >
                            {member.result_status.status === "RECORDED" ? "Update Result" : "Record Result"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        {searchTerm ? "No results found" : "No members available"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {filteredMembers.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMembers.length)} of{" "}
                    {filteredMembers.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} of {totalPages || 1}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Record Result Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Exam Result</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                {selectedMember && (
                  <form action={handleSubmit} className="space-y-2">
                    <input type="hidden" name="memberId" value={selectedMember.member_id} />

                    <div>
                      <span className="font-medium">Member:</span> {selectedMember.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedMember.email}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="score">Score (%)</Label>
                      <Input
                        id="score"
                        name="score"
                        type="number"
                        // min="0"
                        // max="100"
                        defaultValue={selectedMember.result_status.score || 0}
                        placeholder="Enter score (0-100)"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Input id="remarks" name="remarks" placeholder="Add any comments about the result" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={recordExamsIsExecuting}>
                        {recordExamsIsExecuting ? "Saving..." : "Save Result"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="hidden">
        <div ref={exportRef} id="exportContent"></div>
      </div>
    </div>
  )
}

export default withAuth(ExamDetail)

