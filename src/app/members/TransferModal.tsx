"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import { getAllCells } from "@/app/actions/cells";
import Select, { SingleValue } from "react-select";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { transferMember } from "@/app/actions/cells/transfer";

import { toast } from "sonner";
import { status } from "./@types";

type CellOption = {
  id: string;
  value: string;
  label: string;
};

const TransferModal = ({
  member_id,
  member_name,
  getMembers,
}: {
  member_id: string;
  member_name: string;
  getMembers: () => void;
}) => {
  const {
    execute: executeGetCells,
    status: getCellStatus,
    result: cellResult,
  } = useAction(getAllCells);

  const { execute: executeTransferMember, status: transferStatus } =
    useAction(transferMember);

  useEffect(() => {
    executeGetCells();
  }, [executeGetCells]);

  useEffect(() => {
    if (cellResult?.data) {
      const options = cellResult.data.data.map(
        (cell: { cell_id: string; cell_name: string }) => ({
          id: cell.cell_id,
          value: cell.cell_id,
          label: cell.cell_name,
        })
      );
      setCellOptions(options);
    }
  }, [cellResult]);

  const [cellOptions, setCellOptions] = useState<CellOption[]>([]);
  const [selectedCell, setSelectedCell] = useState<CellOption | null>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCell) {
      toast.error("Please select a cell");
      return;
    }

    // Log the data being sent to the server
    const transferData = {
      member_id,
      new_cell_id: selectedCell.value, 
      new_status: status.TRANSFERRED,
      remarks: remarks || "Member transferred",
    };

    console.log("Transfer Data:", transferData);

    try {
      executeTransferMember(transferData);
    } catch (error) {
      console.error("Transfer Error:", error);
      toast.error(`Transfer failed: ${error}`);
    }
  };
  // Handle transfer result
  useEffect(() => {
    if (transferStatus === "hasSucceeded") {
      toast.success(`${member_name} transferred successfully`);
      setIsOpen(false);
      setSelectedCell(null);
      setRemarks("");

      // Refresh the member data
      getMembers(); // Call the `getMembers` function from the parent component
    } else if (transferStatus === "hasErrored") {
      toast.error("Failed to transfer member");
    }
  }, [transferStatus, member_name, getMembers]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-500 text-white hover:bg-purple-900 rounded-lg px-4 py-2">
          Transfer
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer {member_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <Label htmlFor="new_cell_name">New Cell Name</Label>
            <Select
              id="new_cell_id"
              options={cellOptions}
              value={cellOptions.find(
                (option) => option.value === selectedCell?.value
              )}
              onChange={(newValue: SingleValue<CellOption>) =>
                setSelectedCell(newValue)
              }
              placeholder="Select Cell"
              isLoading={getCellStatus === "executing"}
              isDisabled={getCellStatus === "executing"}
              getOptionValue={(option) => option.value} // Key fix
            />
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter transfer remarks"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={transferStatus === "executing"}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={transferStatus === "executing" || !selectedCell}
              className="bg-purple-500 text-white hover:bg-purple-900"
            >
              {transferStatus === "executing" ? "Transferring..." : "Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
