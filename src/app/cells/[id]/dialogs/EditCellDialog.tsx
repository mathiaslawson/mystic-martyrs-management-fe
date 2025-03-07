"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EditCellDialogProps } from "../../@types"



export default function EditCellDialog({
  isOpen,
  setIsOpen,
  cellData,
  editData,
  setEditData,
  handleSubmit,
  isUpdating,
}: EditCellDialogProps) {

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Cell</DialogTitle>
          <DialogDescription>Make changes to the Cell here. Click save when you&rsquo;re done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cell_name" className="text-right">
                Name
              </Label>
              <Input
                id="cell_name"
                value={editData.cell_name || cellData?.cell?.cell_name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    cell_name: e.target.value,
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
              className="bg-green-800 text-white hover:bg-green-700"
              disabled={isUpdating}
            >
              {isUpdating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

