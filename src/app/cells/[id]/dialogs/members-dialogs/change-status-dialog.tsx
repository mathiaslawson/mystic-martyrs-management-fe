"use client";

import type { Member } from "@/app/cells/@types";
import { changeCellMemberStatus } from "@/components/@Global/actions/cells/transfer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "next-safe-action/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type MemberStatus = "ACTIVE" | "INACTIVE" | "TRANSFERRED" | "LEFT";

type ChangeStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMember: Member | null;
  refreshData: ()=>void
};

export function ChangeStatusDialog({ open, onOpenChange, selectedMember, refreshData }: ChangeStatusDialogProps) {
  const { execute: changeMemberStatus, status: changeStatus } = useAction(changeCellMemberStatus);

  const [statusData, setStatusData] = useState<{ new_status: MemberStatus | ""; remarks: string }>({
    new_status: "",
    remarks: "",
  });

  useEffect(() => {
    if (changeStatus === "hasSucceeded") {
      toast.success(`Status updated successfully`);
      refreshData()
      setStatusData({ new_status: "", remarks: "" });
      onOpenChange(false);
    } else if (changeStatus === "hasErrored") {
      toast.error("Failed to update status. Try again.");
    }
  }, [changeStatus, onOpenChange, refreshData]);

  const updateStatus = (value: string) => {
    if (["ACTIVE", "INACTIVE", "TRANSFERRED", "LEFT"].includes(value) || value === "") {
      setStatusData((prev) => ({ ...prev, new_status: value as MemberStatus | "" }));
    }
  };

  const handleSubmit = () => {
    if (!statusData.new_status) {
      toast.error("Please select a new status.");
      return;
    }

    if (!selectedMember?.member_id) {
      toast.error("Member ID is missing.");
      return;
    }

    changeMemberStatus({
      member_id: selectedMember.member_id, 
      new_status: statusData.new_status, 
      remarks: statusData.remarks,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Member Status</DialogTitle>
          <DialogDescription>
            Update the status of <strong>{selectedMember?.firstname} {selectedMember?.lastname}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">New Status</Label>
            <Select value={statusData.new_status} onValueChange={updateStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                {/* <SelectItem value="TRANSFERRED">TRANSFERRED</SelectItem> */}
                <SelectItem value="LEFT">LEFT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status-remarks" className="text-right">Remarks</Label>
            <Textarea
              id="status-remarks"
              value={statusData.remarks}
              onChange={(e) => setStatusData((prev) => ({ ...prev, remarks: e.target.value }))}
              className="col-span-3"
              placeholder="Enter remarks (optional)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!statusData.new_status || changeStatus === "executing"}>
            {changeStatus === "executing" ? "Processing..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
