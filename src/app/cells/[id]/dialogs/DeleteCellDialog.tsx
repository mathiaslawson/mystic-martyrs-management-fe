"use client"

import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteCellDialogProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  handleConfirm: () => void
  isDeleting: boolean
}

export default function DeleteCellDialog({ isOpen, setIsOpen, handleConfirm, isDeleting }: DeleteCellDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this Cell?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the cell and all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="bg-green-800 text-white hover:bg-green-700"
            disabled={isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

