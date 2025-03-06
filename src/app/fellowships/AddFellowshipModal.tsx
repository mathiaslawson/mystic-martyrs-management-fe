'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Select from 'react-select'
import { getAllZones } from '@/components/@Global/actions/zones'
import { addFellowship } from '../../components/@Global/actions/fellowships'


interface Zone {
  value: string
  label: string
}

export function AddFellowshipModal({ onFellowshipAdded }: { onFellowshipAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [fellowshipName, setFellowshipName] = useState('')

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  // const [fellowshipLeaderOptions, setFellowshipLeaderOptions] = useState<FellowshipLeader[]>([])
  const [zoneOptions, setZoneOptions] = useState<Zone[]>([])
  const [shouldFetchData, setShouldFetchData] = useState(false)

  const { execute: executeAddFellowship, status: addFellowshipStatus, result: addFellowshipResult, reset: resetAddFellowship } = useAction(addFellowship)
  // const { execute: executeGetFellowshipLeaders, status: getFellowshipLeadersStatus, result: fellowshipLeadersResult } = useAction(getFellowshipLeaders)
  const { execute: executeGetZones, status: getZonesStatus, result: zonesResult } = useAction(getAllZones)

  useEffect(() => {
    if (isOpen && shouldFetchData) {
      // executeGetFellowshipLeaders()
      executeGetZones()
      setShouldFetchData(false)
    }
  }, [isOpen, shouldFetchData, executeGetZones])


  useEffect(() => {
    if (zonesResult?.data) {
      const options = zonesResult.data.data.map((zone: { zone_id: string; zone_name: string }) => ({
        value: zone.zone_id,
        label: zone.zone_name
      }))
      setZoneOptions(options)
    }
  }, [zonesResult])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fellowshipName  || !selectedZone) {
      toast.error('Please fill in all fields')
      return
    }

    executeAddFellowship({
      fellowship_name: fellowshipName,

      zone_id: selectedZone.value
    })
  }

  const handleActionComplete = useCallback(() => {
    if (addFellowshipResult?.data?.success) {
      toast.success('Fellowship added successfully')
      setIsOpen(false)
      setFellowshipName('')
     
      setSelectedZone(null)
      onFellowshipAdded()
      resetAddFellowship()  
    } else if (addFellowshipResult?.data?.message) {
      toast.error(addFellowshipResult.data.message)
      resetAddFellowship()
    }
  }, [addFellowshipResult, onFellowshipAdded, resetAddFellowship])

  useEffect(() => {
    if (addFellowshipStatus === 'hasSucceeded') {
      handleActionComplete()
    } else if (addFellowshipStatus === 'hasErrored') {
      toast.error('An error occurred while adding the fellowship')
      resetAddFellowship()  
    }
  }, [addFellowshipStatus, handleActionComplete, resetAddFellowship])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setShouldFetchData(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-black hover:text-neutral-700 bg-neutral-300 hover:bg-neutral-200">
          <Plus className="mr-2 h-4 w-4" /> Add Fellowship
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Fellowship</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fellowship_name">Fellowship Name</Label>
            <Input
              id="fellowship_name"
              value={fellowshipName}
              onChange={(e) => setFellowshipName(e.target.value)}
              placeholder="Enter fellowship name"
            />
          </div>
          {/* <div>
            <Label htmlFor="fellowship_leader_id">Fellowship Leader</Label>
            <Select
              id="fellowship_leader_id"
              options={fellowshipLeaderOptions}
              value={selectedLeader}
              onChange={(newValue) => setSelectedLeader(newValue as FellowshipLeader)}
              placeholder="Select fellowship leader"
              isLoading={getFellowshipLeadersStatus === 'executing'}
              isDisabled={getFellowshipLeadersStatus === 'executing'}
            />
          </div> */}
          <div>
            <Label htmlFor="zone_id">Fellowship Zone</Label>
            <Select
              id="zone_id"
              options={zoneOptions}
              value={selectedZone}
              onChange={(newValue) => setSelectedZone(newValue as Zone)}
              placeholder="Select zone"
              isLoading={getZonesStatus === 'executing'}
              isDisabled={getZonesStatus === 'executing'}
            />
          </div>
          <div className='flex gap-2 '>
            <Button
              type="submit"
              className="w-1/2 bg-red-600 text-white hover:text-neutral-700"
              disabled={addFellowshipStatus === 'executing' || getZonesStatus === 'executing'}
            >
              {addFellowshipStatus === 'executing' ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Adding Fellowship...
                </>
              ) : (
                'Add Fellowship'
              )}
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-1/2 text-black bg-neutral-300 hover:text-neutral-700"
              disabled={addFellowshipStatus === 'executing' || getZonesStatus === 'executing'}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}