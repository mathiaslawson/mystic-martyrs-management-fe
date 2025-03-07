'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { addZone } from '@/components/@Global/actions/zones'


export function AddZoneModal({ onZoneAdded }: { onZoneAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [zoneName, setZoneName] = useState('')
  const [zoneLocation, setZoneLocation] = useState('')


  const { execute: executeAddZone, status: addZoneStatus, result: addZoneResult, reset: resetAddZone } = useAction(addZone)
 


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!zoneName || !zoneLocation) {
    toast.error('Please fill in all fields')
    return
  }

   executeAddZone({
    zone_name: zoneName,
    zone_location: zoneLocation, 
    zone_leader_id: ""
  })
}

const handleActionComplete = useCallback(() => {
  if (addZoneResult?.data?.success) {
    toast.success('Zone added successfully')
    setIsOpen(false)
    setZoneName('')
    setZoneLocation('')
    onZoneAdded()
    resetAddZone()  
  } else if (addZoneResult?.data?.message) {
    toast.error(addZoneResult.data.message)
    resetAddZone()
  }
}, [addZoneResult, onZoneAdded, resetAddZone])

useEffect(() => {
  if (addZoneStatus === 'hasSucceeded') {
    handleActionComplete()
  } else if (addZoneStatus === 'hasErrored') {
    toast.error('An error occurred while adding the zone')
    resetAddZone()  
  }
}, [addZoneStatus, handleActionComplete, resetAddZone])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-600 text-white hover:bg-yellow-700">
          <Plus className="mr-2 h-4 w-4" /> Add Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Zone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="zone_name">Zone Name</Label>
            <Input
              id="zone_name"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="Enter zone name"
            />
          </div>
          <div>
            <Label htmlFor="zone_location">Zone Location</Label>
            <Input
              id="zone_location"
              value={zoneLocation}
              onChange={(e) => setZoneLocation(e.target.value)}
              placeholder="Enter zone location"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-yellow-600 text-white hover:bg-yellow-700"
            disabled={addZoneStatus === 'executing'}
          >
            {addZoneStatus === 'executing' ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Adding Zone...
              </>
            ) : (
              'Add Zone'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}