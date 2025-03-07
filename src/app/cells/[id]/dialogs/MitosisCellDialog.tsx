"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useAction } from "next-safe-action/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { divideCell } from "@/components/@Global/actions/cells/mitosis";
import { MitosisCellDialogProps } from "../../@types";



export default function MitosisCellDialog({
  isOpen,
  setIsOpen,
  cellData,
}: MitosisCellDialogProps) {
  const [newCellName, setNewCellName] = useState("");
  const [reason, setReason] = useState("");

  const {
    execute: executeDivideCell,
    status: divideCellStatus,
    result: divideCellResult,
    reset: resetDivideCell,
  } = useAction(divideCell);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCellName || !reason) {
      toast.error("Please fill in all fields");
      return;
    }

    executeDivideCell({
      cell_id: cellData?.cell?.cell_id,
      new_cell_name: newCellName,
      reason: reason,
    });
  };

  const handleActionComplete = useCallback(() => {
    if (divideCellResult?.data?.success) {
      toast.success("Cell divided successfully");
      setIsOpen(false);
      setNewCellName("");
      setReason("");
      resetDivideCell();
    } else if (divideCellResult?.data?.message) {
      toast.error(divideCellResult.data.message);
      resetDivideCell();
    }
  }, [divideCellResult, resetDivideCell, setIsOpen]);

  useEffect(() => {
    if (divideCellStatus === "hasSucceeded") {
      handleActionComplete();
    } else if (divideCellStatus === "hasErrored") {
      toast.error("An error occurred while dividing the cell");
      resetDivideCell();
    }
  }, [divideCellStatus, handleActionComplete, resetDivideCell]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cell Mitosis</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new_cell_name">New Cell Name</Label>
            <Input
              id="new_cell_name"
              value={newCellName}
              onChange={(e) => setNewCellName(e.target.value)}
              placeholder="Enter new cell name"
            />
          </div>
          <div>
            <Label htmlFor="reason">Reason for Mitosis</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for cell division"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="w-1/2 bg-green-600 text-white hover:text-neutral-700"
              disabled={divideCellStatus === "executing"}
            >
              {divideCellStatus === "executing" ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Dividing Cell...
                </>
              ) : (
                "Divide Cell"
              )}
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-1/2 text-black bg-neutral-300 hover:text-neutral-700"
              disabled={divideCellStatus === "executing"}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
