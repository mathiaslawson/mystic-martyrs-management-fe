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
import { addCell, getCellLeaders } from '../actions/cells'
import { getAllFellowships } from '../actions/fellowships'

interface CellLeader {
  value: string
  label: string
}

interface Fellowship {
  value: string
  label: string
}

export function AddCellModal({ onCellAdded }: { onCellAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [cellName, setCellName] = useState('')
  const [selectedLeader, setSelectedLeader] = useState<CellLeader | null>(null)
  const [selectedFellowship, setSelectedFellowship] = useState<Fellowship | null>(null)
  const [cellLeaderOptions, setCellLeaderOptions] = useState<CellLeader[]>([])
  const [fellowshipOptions, setFellowshipOptions] = useState<Fellowship[]>([])
  const [shouldFetchData, setShouldFetchData] = useState(false)

  const { execute: executeAddCell, status: addCellStatus, result: addCellResult, reset: resetAddCell } = useAction(addCell)
  const { execute: executeGetCellLeaders, status: getCellLeadersStatus, result: cellLeadersResult } = useAction(getCellLeaders)
  const { execute: executeGetFellowships, status: getFellowshipsStatus, result: fellowshipsResult } = useAction(getAllFellowships)

  useEffect(() => {
    if (isOpen && shouldFetchData) {
      executeGetCellLeaders()
      executeGetFellowships()
      setShouldFetchData(false)
    }
  }, [isOpen, shouldFetchData, executeGetCellLeaders, executeGetFellowships])

  useEffect(() => {
    if (cellLeadersResult?.data) {
      const options = cellLeadersResult.data.map((leader: { member_id: string; firstname: string; lastname: string }) => ({
        value: leader.member_id,
        label: `${leader.firstname} ${leader.lastname}`
      }))
      setCellLeaderOptions(options)
    }
  }, [cellLeadersResult])

  useEffect(() => {
    if (fellowshipsResult?.data) {
      const options = fellowshipsResult.data.data.map((fellowship: { fellowship_id: string; fellowship_name: string }) => ({
        value: fellowship.fellowship_id,
        label: fellowship.fellowship_name
      }))
      setFellowshipOptions(options)
    }
  }, [fellowshipsResult])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cellName || !selectedLeader || !selectedFellowship) {
      toast.error('Please fill in all fields')
      return
    }

    executeAddCell({
      cell_name: cellName,
      cell_leader_id: selectedLeader.value,
      fellowship_id: selectedFellowship.value
    })
  }

  const handleActionComplete = useCallback(() => {
    if (addCellResult?.data?.success) {
      toast.success('Cell added successfully')
      setIsOpen(false)
      setCellName('')
      setSelectedLeader(null)
      setSelectedFellowship(null)
      onCellAdded()
      resetAddCell()  
    } else if (addCellResult?.data?.message) {
      toast.error(addCellResult.data.message)
      resetAddCell()
    }
  }, [addCellResult, onCellAdded, resetAddCell])

  useEffect(() => {
    if (addCellStatus === 'hasSucceeded') {
      handleActionComplete()
    } else if (addCellStatus === 'hasErrored') {
      toast.error('An error occurred while adding the cell')
      resetAddCell()  
    }
  }, [addCellStatus, handleActionComplete, resetAddCell])

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
          <Plus className="mr-2 h-4 w-4" /> Add Cell
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Cell</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cell_name">Cell Name</Label>
            <Input
              id="cell_name"
              value={cellName}
              onChange={(e) => setCellName(e.target.value)}
              placeholder="Enter cell name"
            />
          </div>
          <div>
            <Label htmlFor="cell_leader_id">Cell Leader</Label>
            <Select
              id="cell_leader_id"
              options={cellLeaderOptions}
              value={selectedLeader}
              onChange={(newValue) => setSelectedLeader(newValue as CellLeader)}
              placeholder="Select cell leader"
              isLoading={getCellLeadersStatus === 'executing'}
              isDisabled={getCellLeadersStatus === 'executing'}
            />
          </div>
          <div>
            <Label htmlFor="fellowship_id">Fellowship</Label>
            <Select
              id="fellowship_id"
              options={fellowshipOptions}
              value={selectedFellowship}
              onChange={(newValue) => setSelectedFellowship(newValue as Fellowship)}
              placeholder="Select fellowship"
              isLoading={getFellowshipsStatus === 'executing'}
              isDisabled={getFellowshipsStatus === 'executing'}
            />
          </div>
          <div className='flex gap-2 '>
            <Button
              type="submit"
              className="w-1/2 bg-green-600 text-white hover:text-neutral-700"
              disabled={addCellStatus === 'executing' || getCellLeadersStatus === 'executing' || getFellowshipsStatus === 'executing'}
            >
              {addCellStatus === 'executing' ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Adding Cell...
                </>
              ) : (
                'Add Cell'
              )}
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-1/2 text-black bg-neutral-300 hover:text-neutral-700"
              disabled={addCellStatus === 'executing' || getCellLeadersStatus === 'executing' || getFellowshipsStatus === 'executing'}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}