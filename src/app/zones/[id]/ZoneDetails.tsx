"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, MapPin, ArrowLeft, Edit, Trash2, Loader, RefreshCw } from "lucide-react"
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
import { deleteZone, getZoneByID, updateZone } from "@/app/actions/zones"
import { withAuth } from "@/components/hoc/withAuth"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ZoneData {
  zone_id: string
  zone_name: string
  zone_leader_id: string
  zone_location: string
  created_at: string
  updated_at: string
  zone_leader: {
    member_id: string
    user_id: string
    firstname: string
    lastname: string
    email: string
    gender: string
    role: string
    birth_date: string
    occupation: string
    address: string
  }
  fellowships: Array<{
    fellowship_id: string
    zone_id: string
    fellowship_name: string
    fellowship_leader_id: string
    created_at: string
    updated_at: string
  }>
}

const ZoneDetail = ({ data }: { data: ZoneData }) => {

 const router = useRouter()

  const { execute: getDetails, result: details, isExecuting: isLoadingDetails } = useAction(getZoneByID)
  const { execute: updateDetails, isExecuting: isUpdating, result: updateResult } = useAction(updateZone)
  const { execute: deleteDetails, isExecuting: isDeleting, result: deleteResult } = useAction(deleteZone)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editData, setEditData] = useState({
    zone_name: "",
    zone_leader_id: "",
    zone_location: "",
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = async () => {
    setIsRefreshing(true)
    getDetails({ id: data?.zone_id })
    setIsRefreshing(false)
  }

  useEffect(() => {
    getDetails({ id: data?.zone_id })
  }, [getDetails, data?.zone_id])

  useEffect(() => {
    if (updateResult?.data?.statusCode === 409 || updateResult?.data?.statusCode === 500) {
      toast.error(updateResult.data.message)
      setIsEditOpen(false)
    }
    console.log(updateResult?.data?.success, 'are you success')
    if (updateResult?.data?.success === true) {
       refreshData()
      toast.success('Zone Updated Successfully')
      setIsEditOpen(false)
  
    }
  }, [updateResult, data?.zone_id])

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateDetails({
      id: details?.data?.data?.zone_id,
      zone_name: editData.zone_name || details?.data?.data?.zone_name,
      zone_location: editData.zone_location || details?.data?.data?.zone_location,
      zone_leader_id: editData.zone_leader_id || details?.data?.data?.zone_leader_id,
    })
  }

  const handleDeleteConfirm = () => {
    deleteDetails({ id: details?.data?.data?.zone_id })
    console.log("Delete confirmed for zone:", data.zone_id)

   
  }

  useEffect(() => {
    if (deleteResult?.data?.statusCode === 404) {
      toast.error(deleteResult.data.message)
      setIsDeleteOpen(false)
    }
    console.log(deleteResult?.data?.success, 'are you success')
    if (deleteResult?.data?.success === true) {
      setIsDeleteOpen(false)
      toast.success('Zone Deleted Successfully')
      router.push('/zones'  )
    }
  }, [deleteResult, data?.zone_id])

  if (isLoadingDetails) {
    return (
      <div className="col-span-full flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    )
  }

  const zoneData = details?.data?.data

  if (!zoneData) {
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen xl:mt-[-0.5rem] mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/zones">
            <Button variant="outline" className="bg-yellow-800 text-white hover:bg-yellow-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Zones
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
                        value={editData.zone_name || zoneData.zone_name}
                        onChange={(e) => setEditData({ ...editData, zone_name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="zone_location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="zone_location"
                        value={editData.zone_location || zoneData.zone_location}
                        onChange={(e) => setEditData({ ...editData, zone_location: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" variant="outline" className="bg-yellow-800 text-white hover:bg-yellow-700" disabled={isUpdating}>
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
                  <DialogTitle>Are you sure you want to delete this zone?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the zone
                    and all associated data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
                 <Button type="submit" variant="outline" className="bg-yellow-800 text-white hover:bg-yellow-700" disabled={isDeleting} onClick={handleDeleteConfirm}>
                      {isDeleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Delete
                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-8 text-neutral-900">{zoneData.zone_name}</h1>
        
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
            <CardHeader className="text-black rounded-t-lg bg-yellow-100">
              <CardTitle>Zone Information</CardTitle>
              <CardDescription className="text-yellow-900">Details about the zone</CardDescription>
              <div className="border-yellow-600 mt-3 bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-yellow-800 px-3 py-1 rounded-full">
                    {zoneData.zone_name}
                  </Badge>
                  <span className="text-sm text-gray-500">ID: {zoneData.zone_id}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                  <span>{zoneData.zone_location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CalendarDays className="w-5 h-5 text-yellow-600" />
                  <span>Created on {formatDate(zoneData.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-yellow-100 text-black rounded-t-lg">
              <CardTitle>Zone Leader</CardTitle>
              <CardDescription className="text-yellow-900">Information about the zone leader</CardDescription>
              <div className="border-yellow-600 mt-3 bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${zoneData.zone_leader.firstname} ${zoneData.zone_leader.lastname}`} />
                  <AvatarFallback>{zoneData.zone_leader.firstname[0]}{zoneData.zone_leader.lastname[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{zoneData.zone_leader.firstname} {zoneData.zone_leader.lastname}</p>
                  <p className="text-sm text-gray-500">{zoneData.zone_leader.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    {zoneData.zone_leader.role}
                  </Badge>
                  <span>{zoneData.zone_leader.gender}</span>
                </div>
                <p className="text-sm text-gray-600">Born on {formatDate(zoneData.zone_leader.birth_date)}</p>
                {zoneData.zone_leader.occupation && (
                  <p className="text-sm text-gray-600">Occupation: {zoneData.zone_leader.occupation}</p>
                )}
                {zoneData.zone_leader.address && (
                  <p className="text-sm text-gray-600">Address: {zoneData.zone_leader.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-3">
            <CardHeader className="bg-yellow-100 text-black rounded-t-lg">
              <CardTitle>Fellowships</CardTitle>
              <CardDescription className="text-yellow-900">Fellowships in this zone</CardDescription>
              <div className="border-yellow-600 mt-3 bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-lg w-full h-2 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fellowship Name</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zoneData.fellowships.map((fellowship : {fellowship_id: string, zone_id: string, fellowship_name: string, fellowship_leader_id: string, created_at: string, updated_at: string}) => (
                    <TableRow key={fellowship.fellowship_id}>
                      <TableCell className="font-medium">{fellowship.fellowship_name}</TableCell>
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