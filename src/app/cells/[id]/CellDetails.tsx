"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, ArrowLeft, Edit, Trash2, Loader, RefreshCw } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAction } from "next-safe-action/hooks"
import { withAuth } from "@/components/hoc/withAuth"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { deleteCell, getCellsByID, updateCell } from "@/app/actions/cells"

const CellDetail = ({ data }: { data: {cell_id: string, cell_name: string, cell_leader_id: string} }) => {
  const router = useRouter()

  const { execute: getDetails, result: details, isExecuting: isLoadingDetails } = useAction(getCellsByID)
  const { execute: updateDetails, isExecuting: isUpdating, result: updateResult } = useAction(updateCell)
  const { execute: deleteDetails, isExecuting: isDeleting, result: deleteResult } = useAction(deleteCell)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editData, setEditData] = useState({
    cell_name: "",
    cell_leader_id: "",
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData =useCallback(
    async () => {
      setIsRefreshing(true)
      getDetails({ id: data?.cell_id })
      setIsRefreshing(false)
    },[]
  ) 

  useEffect(() => {
    getDetails({ id: data?.cell_id })
  }, [getDetails, data?.cell_id])

  useEffect(() => {
    if (updateResult?.data?.statusCode === 409 || updateResult?.data?.statusCode === 500) {
      toast.error(updateResult.data.message)
      setIsEditOpen(false)
    }
    if (updateResult?.data?.success === true) {
      refreshData()
      toast.success('Cell Updated Successfully')
      setIsEditOpen(false)
    }
  }, [updateResult, data?.cell_id,refreshData])

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateDetails({
      id: details?.data?.data?.cell_id,
      cell_name: editData.cell_name || details?.data?.data?.cell_name,
    })
  }

  const handleDeleteConfirm = () => {
    deleteDetails({ id: details?.data?.data?.cell_id })
  }

  useEffect(() => {
    if (deleteResult?.data?.statusCode === 404) {
      toast.error(deleteResult.data.message)
      setIsDeleteOpen(false)
    }
    if (deleteResult?.data?.success === true) {
      setIsDeleteOpen(false)
      toast.success('Cell Deleted Successfully')
      router.push('/cells')
    }
  }, [deleteResult, data?.cell_id,router])

  if (isLoadingDetails) {
    return (
      <div className="col-span-full flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  const cellData = details?.data?.data

  if (!cellData) {
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen xl:mt-[-0.5rem] mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/cells">
            <Button variant="outline" className="bg-green-800 text-white hover:bg-green-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cells
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              onClick={refreshData}
              disabled={isRefreshing}
              className="text-black"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button className="text-black mr-2">
                  <Edit className="mr-2 h-4" /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Cell</DialogTitle>
                  <DialogDescription>
                    Make changes to the Cell here. Click save when you&rsquo;re done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cell_name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="cell_name"
                        value={editData.cell_name || cellData.cell_name}
                        onChange={(e) => setEditData({ ...editData, cell_name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" variant="outline" className="bg-green-800 text-white hover:bg-green-700" disabled={isUpdating}>
                      {isUpdating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button className="text-black">
                  <Trash2 className="mr-2 h-4" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this Cell?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the cell
                    and all associated data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
                 <Button type="submit" variant="outline" className="bg-green-800 text-white hover:bg-green-700" disabled={isDeleting} onClick={handleDeleteConfirm}>
                      {isDeleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Delete
                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-8 text-neutral-900">{cellData.cell_name}</h1>
        
        <div className="grid gap-8 md:grid-cols-12 lg:grid-cols-3 mb-8">
          <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-1">
            <CardHeader className="text-black rounded-t-lg bg-green-100">
              <CardTitle>Cell Information</CardTitle>
              <CardDescription className="text-green-900">Details about the cell</CardDescription>
              <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-green-800 px-3 py-1 rounded-full">
                    {cellData.cell_name}
                  </Badge>
                 
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CalendarDays className="w-5 h-5 text-green-600" />
                  <span>Created on {formatDate(cellData.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-2">
            <CardHeader className="text-black rounded-t-lg bg-green-100">
              <CardTitle>Fellowship Information</CardTitle>
              <CardDescription className="text-green-900">Details of associated fellowship</CardDescription>
              <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-green-800 px-3 py-1 rounded-full">
                    {cellData.fellowship?.fellowship_name}
                  </Badge>
                  <span className="text-sm text-gray-500">ID: {cellData.fellowship?.fellowship_id}</span>
                </div>
                {/* <Link href={`fellowships/${cellData.fellowship?.fellowship_id}`}>
                <div className="text-sm text-neutral-500 mx-4 underline">Visit Fellowship</div>
                </Link> */}
              </div>
            </CardContent>
          </Card>

      
           {/* leaders */}
          <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
            <CardHeader className="bg-green-100 text-black rounded-t-lg">
              <CardTitle>Cell Leaders</CardTitle>
              <CardDescription className="text-green-900">
               Leaders heading this Cell
              </CardDescription>
              <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leader Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cellData.leaders?.map(
                    (leaders: {
                      member: {
                      member_id: string;
                      firstname: string
                      created_at: string;
                      lastname: string;
                      email:string;
                      role: string;
                     }
                    }) => (
                      <TableRow key={leaders?.member?.member_id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${leaders?.member?.firstname} ${leaders?.member?.lastname}`}
                              />
                              <AvatarFallback>
                                {leaders?.member?.firstname}
                                {leaders?.member?.lastname}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-lg">
                                {leaders?.member?.firstname} {leaders?.member?.lastname}
                              </p>
                              <p className="text-sm text-gray-500">
                                {leaders?.member?.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                         {leaders?.member?.email}
                        </TableCell>
                        <TableCell>
                             <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                        >
                          {leaders?.member?.role}
                        </Badge>
                        </TableCell>
                          <TableCell>
                          {formatDate(leaders?.member?.created_at)}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
              <div className="text-center text-neutral-500 mt-10 text-sm">
                    {cellData.leaders.length === 0 && "No Cell Leaders"}
                </div>
            </CardContent>
          </Card>

{/* members2 */}
           <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
            <CardHeader className="bg-green-100 text-black rounded-t-lg">
              <CardTitle>Cell Memebers</CardTitle>
              <CardDescription className="text-green-900">
               Members within this cell
              </CardDescription>
              <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cellData.members?.map(
                    (leaders: {
                      
                      member_id: string;
                      firstname: string
                      created_at: string;
                      lastname: string;
                      email:string;
                      role: string;
                     
                    }) => (
                      <TableRow key={leaders?.member_id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${leaders?.firstname} ${leaders?.lastname}`}
                              />
                              <AvatarFallback>
                                {leaders?.firstname}
                                {leaders?.lastname}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-lg">
                                {leaders?.firstname} {leaders?.lastname}
                              </p>
                              <p className="text-sm text-gray-500">
                                {leaders?.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                         {leaders?.email}
                        </TableCell>
                        <TableCell>
                             <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                        >
                          {leaders?.role}
                        </Badge>
                        </TableCell>
                          <TableCell>
                          {formatDate(leaders?.created_at)}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
                <div className="text-center text-neutral-500 mt-10 text-sm">
                    {cellData.members.length === 0 && "No Cell Members"}
                </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default withAuth(CellDetail)