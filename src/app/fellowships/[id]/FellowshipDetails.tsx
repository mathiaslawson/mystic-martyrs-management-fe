"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, ArrowLeft, Edit, Trash2, Loader, RefreshCw, MapPin } from "lucide-react"
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
import { deleteFellowship, getFellowshipByID, updateFellowship } from "@/app/actions/fellowships"


const ZoneDetail = ({ data }: { data: {fellowship_id: string, fellowship_name: string, fellowship_leader_id: string} }) => {

 const router = useRouter()

  const { execute: getDetails, result: details, isExecuting: isLoadingDetails } = useAction(getFellowshipByID)
  const { execute: updateDetails, isExecuting: isUpdating, result: updateResult } = useAction(updateFellowship)
  const { execute: deleteDetails, isExecuting: isDeleting, result: deleteResult } = useAction(deleteFellowship)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editData, setEditData] = useState({
    fellowship_name: "",
    fellowship_leader_id: "",
    fellowship_location: "",
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = async () => {
    setIsRefreshing(true)
    getDetails({ id: data?.fellowship_id })
    setIsRefreshing(false)
  }

  useEffect(() => {
    getDetails({ id: data?.fellowship_id })
  }, [getDetails, data?.fellowship_id])

  useEffect(() => {
    if (updateResult?.data?.statusCode === 409 || updateResult?.data?.statusCode === 500) {
      toast.error(updateResult.data.message)
      setIsEditOpen(false)
    }
    console.log(updateResult?.data?.success, 'are you success')
    if (updateResult?.data?.success === true) {
       refreshData()
      toast.success('Fellowship Updated Successfully')
      setIsEditOpen(false)
  
    }
  }, [updateResult, data?.fellowship_id])

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateDetails({
      id: details?.data?.data?.fellowship_id,
      fellowship_name: editData.fellowship_name || details?.data?.data?.fellowship_name,
      fellowship_leader_id: editData.fellowship_leader_id || details?.data?.data?.fellowship_leader_id,
    })
  }

  const handleDeleteConfirm = () => {
    deleteDetails({ id: details?.data?.data?.fellowship_id })
  }

  useEffect(() => {
    if (deleteResult?.data?.statusCode === 404) {
      toast.error(deleteResult.data.message)
      setIsDeleteOpen(false)
    }
    console.log(deleteResult?.data?.success, 'are you success')
    if (deleteResult?.data?.success === true) {
      setIsDeleteOpen(false)
      toast.success('Fellowship Deleted Successfully')
      router.push('/fellowships'  )
    }
  }, [deleteResult, data?.fellowship_id])

  if (isLoadingDetails) {
    return (
      <div className="col-span-full flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  const fellowshipData = details?.data?.data

  if (!fellowshipData) {
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen xl:mt-[-0.5rem] mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/fellowships">
            <Button variant="outline" className="bg-red-800 text-white hover:bg-red-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fellowships
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
                  <DialogTitle>Edit Fellowship</DialogTitle>
                  <DialogDescription>
                    Make changes to the Fellowship here. Click save when you&rsquo;re done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fellowship_name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="fellowship_name"
                        value={editData.fellowship_name || fellowshipData.fellowship_name}
                        onChange={(e) => setEditData({ ...editData, fellowship_name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="zone_location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="zone_location"
                        value={editData.zone_location || fellowshipData.zone_location}
                        onChange={(e) => setEditData({ ...editData, zone_location: e.target.value })}
                        className="col-span-3"
                      />
                    </div> */}
                  </div>
                  <DialogFooter>
                    <Button type="submit" variant="outline" className="bg-red-800 text-white hover:bg-red-700" disabled={isUpdating}>
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
                  <DialogTitle>Are you sure you want to delete this Fellowship?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently fellowship the fellowship
                    and all associated data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
                 <Button type="submit" variant="outline" className="bg-red-800 text-white hover:bg-red-700" disabled={isDeleting} onClick={handleDeleteConfirm}>
                      {isDeleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Delete
                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-8 text-neutral-900">{fellowshipData.fellowship_name}</h1>
        
        <div className="grid gap-8 md:grid-cols-12 lg:grid-cols-3 mb-8">
          <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
            <CardHeader className="text-black rounded-t-lg bg-red-100">
              <CardTitle>Fellowship Information</CardTitle>
              <CardDescription className="text-red-900">Details about the fellowship</CardDescription>
              <div className="border-red-600 mt-3 bg-gradient-to-r from-red-500 to-red-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-red-800 px-3 py-1 rounded-full">
                    {fellowshipData.fellowship_name}
                  </Badge>
                  <span className="text-sm text-gray-500">ID: {fellowshipData.fellowship_id}</span>
                </div>
                {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>{fellowshipData.zone_location}</span>
                </div> */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CalendarDays className="w-5 h-5 text-red-600" />
                  <span>Created on {formatDate(fellowshipData.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* zone Infor */}
          <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-2">
            <CardHeader className="text-black rounded-t-lg bg-red-100">
              <CardTitle>Zone Information</CardTitle>
              <CardDescription className="text-red-900">Details associated zone</CardDescription>
              <div className="border-red-600 mt-3 bg-gradient-to-r from-red-500 to-red-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-red-800 px-3 py-1 rounded-full">
                    {fellowshipData.zone?.zone_name}
                  </Badge>
                  <span className="text-sm text-gray-500">ID: {fellowshipData.fellowship_id}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>{fellowshipData.zone?.zone_location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="bg-red-100 text-black rounded-t-lg">
              <CardTitle>Fellowship Leader</CardTitle>
              <CardDescription className="text-red-900">Information about the fellowship leader</CardDescription>
              <div className="border-red-600 mt-3 bg-gradient-to-r from-red-500 to-red-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${fellowshipData.leader.firstname} ${fellowshipData.leader.lastname}`} />
                  <AvatarFallback>{fellowshipData.leader.firstname[0]}{fellowshipData.leader.lastname[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{fellowshipData.leader.firstname} {fellowshipData.leader.lastname}</p>
                  <p className="text-sm text-gray-500">{fellowshipData.leader.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Badge variant="outline" className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    {fellowshipData.leader.role}
                  </Badge>
                  <span>{fellowshipData.leader.gender}</span>
                </div>
                <p className="text-sm text-gray-600">Born on {formatDate(fellowshipData.leader.birth_date)}</p>
                {fellowshipData.leader.occupation && (
                  <p className="text-sm text-gray-600">Occupation: {fellowshipData.leader.occupation}</p>
                )}
                {fellowshipData.leader.address && (
                  <p className="text-sm text-gray-600">Address: {fellowshipData.leader.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
            <CardHeader className="bg-red-100 text-black rounded-t-lg">
              <CardTitle>Fellowships</CardTitle>
              <CardDescription className="text-red-900">Cells in this fellowship</CardDescription>
              <div className="border-red-600 mt-3 bg-gradient-to-r from-red-500 to-red-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cell Name</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fellowshipData.cells?.map((fellowship  : { cell_id: string, cell_name: string, created_at: string, updated_at: string}) => (
                    <TableRow key={fellowship.cell_id}>
                      <TableCell className="font-medium">{fellowship.cell_name}</TableCell>
                      <TableCell>{formatDate(fellowship.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default withAuth(ZoneDetail)