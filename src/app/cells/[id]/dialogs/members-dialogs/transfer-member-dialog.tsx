import { useEffect, useRef, useState } from "react"
import { useAction } from "next-safe-action/hooks"
import Select, { type SingleValue } from "react-select"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getAllCells } from "@/components/@Global/actions/cells"
import { transferMember } from "@/components/@Global/actions/cells/transfer"
import type { Member } from "@/app/cells/@types"

type CellOption = {
  id: string
  value: string
  label: string
}

type TransferMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedMember: Member | null
  onSuccess: () => void
}

export function TransferMemberDialog({
  open,
  onOpenChange,
  selectedMember,
  onSuccess,
}: TransferMemberDialogProps) {
  const { execute: executeGetCells, status: getCellStatus, result: cellResult } = useAction(getAllCells)
  const { execute: executeTransferMember, status: transferStatus } = useAction(transferMember)

  const [cellOptions, setCellOptions] = useState<CellOption[]>([])
  const [selectedCell, setSelectedCell] = useState<CellOption | null>(null)
  const [remarks, setRemarks] = useState<string>("")

  const toastDisplayedRef = useRef(false)

  useEffect(() => {
    if (open) {
      executeGetCells()
    }
  }, [open, executeGetCells])

  useEffect(() => {
    if (cellResult?.data) {
      const options = cellResult.data.data.map((cell: { cell_id: string; cell_name: string }) => ({
        id: cell.cell_id,
        value: cell.cell_id,
        label: cell.cell_name,
      }))
      setCellOptions(options)
    }
  }, [cellResult])

  useEffect(() => {
    if (transferStatus === "hasSucceeded" && !toastDisplayedRef.current) {
      toastDisplayedRef.current = true // Set flag to prevent duplicates
      if (selectedMember) {
        toast.success(`${selectedMember.firstname} ${selectedMember.lastname} updated successfully`)
      }
      onOpenChange(false)
      setSelectedCell(null)
      setRemarks("")
      onSuccess()
    } else if (transferStatus === "hasErrored" && !toastDisplayedRef.current) {
      toastDisplayedRef.current = true
      toast.error("Failed to update member")
    }
  }, [transferStatus, onOpenChange, onSuccess])


  useEffect(() => {
    if (!open) {
      toastDisplayedRef.current = false
      setSelectedCell(null)
      setRemarks("")
    }
  }, [open])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMember || !selectedCell) {
      toast.error("Please select a cell")
      return
    }

    const transferData = {
      member_id: selectedMember.member_id,
      new_cell_id: selectedCell.value,
      remarks: remarks
    }

    try {
      executeTransferMember(transferData)
    } catch (error) {
      console.error("Transfer Error:", error)
      toast.error(`Update failed: ${error}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Update {selectedMember?.firstname} {selectedMember?.lastname}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <Label htmlFor="new_cell_name">New Cell Name</Label>
            <Select
              id="new_cell_id"
              options={cellOptions}
              value={cellOptions.find((option) => option.value === selectedCell?.value)}
              onChange={(newValue: SingleValue<CellOption>) => setSelectedCell(newValue)}
              placeholder="Select Cell"
              isLoading={getCellStatus === "executing"}
              isDisabled={getCellStatus === "executing"}
              getOptionValue={(option) => option.value}
            />
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={transferStatus === "executing"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={transferStatus === "executing" || !selectedCell}
              className="bg-purple-500 text-white hover:bg-purple-900"
            >
              {transferStatus === "executing" ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
