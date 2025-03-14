"use client";

import { useState, useEffect, useCallback } from "react";
import { useAction } from "next-safe-action/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { getAllCells } from "@/components/@Global/actions/cells";
import { createExamination } from "@/components/@Global/actions/cells/examinations";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";
// import { Options } from "../invitation/types";


export function CreateExaminationModal({
  onZoneAdded,
}: {
  onZoneAdded: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  // const [cellOptions, setCellOptions] = useState<Options[]>([]);
  // const [selectedCell, setSelectedCell] = useState<Options | null>(null);
  const [title, setTitle] = useState<string>("");

  const { me } = useAuthMemberStore();
  const member_id = me?.data.member.member_id || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date) {
      console.error("Title and date are required");
      return;
    }

    executeCreateExams({
      cell_id: 'cell_supreme',
      title,
      date,
      created_by_id: member_id,
    });
  };

  const {
    execute: executeGetCells,
    // status: getCellStatus,
    // result: cellResult,
  } = useAction(getAllCells);

  const {
    execute: executeCreateExams,
    status: getCreateExamStatus,
    result,
    reset: resetExamination,
  } = useAction(createExamination);

  useEffect(() => {
    executeGetCells();
  }, [executeGetCells]);

  // useEffect(() => {
  //   if (cellResult?.data?.data && Array.isArray(cellResult.data.data)) {
  //     const options = cellResult.data.data.map(
  //       (cell: {
  //         cell_id: string;
  //         cell_name: string;
  //         fellowship_id: string;
  //         zone_id: string;
  //       }) => ({
  //         value: cell.cell_id,
  //         label: cell.cell_name,
  //         fellowshipId: cell.fellowship_id,
  //         zoneId: cell.zone_id,
  //       })
  //     );
  //     setCellOptions(options);
  //   } else {
  //     console.error(
  //       "cellResult.data.data is not an array:",
  //       cellResult?.data?.data
  //     );
  //     setCellOptions([]);
  //   }
  // }, [cellResult]);

  const handleActionComplete = useCallback(() => {
    if (result?.data?.success) {
      toast.success("Exam created successfully");
      setIsOpen(false);
      // setSelectedCell(null);
      // setZoneLocation('')
      onZoneAdded();
      resetExamination();
    } else if (result?.data?.message) {
      toast.error(result.data.message);
      resetExamination();
    }
  }, [result, onZoneAdded, resetExamination]);

  useEffect(() => {
    if (getCreateExamStatus === "hasSucceeded") {
      handleActionComplete();
    } else if (getCreateExamStatus === "hasErrored") {
      toast.error("An error occurred while creating the exam");
      resetExamination();
    }
  }, [getCreateExamStatus, handleActionComplete, resetExamination]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-neutral-600 text-white hover:bg-neutral-700">
          <Plus className="mr-2 h-4 w-4" /> Create Examination
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="">
          <h1 className="text-3xl font-semibold">Create Examination</h1>
          <p className="text-md text-gray-500">
            Please enter the details for the examination
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-10 mb-5">
            {/* TODO: for the future */}
            {/* <div>
              <Label htmlFor="cell_id">Cell (Optional)</Label>
             <Select
            id="cell_id"
            options={cellOptions}
            value={selectedCell}
            onChange={(newValue) => setSelectedCell(newValue as Options)}
            placeholder="Select Cell"
            isLoading={getCellStatus === "executing"}
            isDisabled={getCellStatus === "executing"}
          />
            </div> */}

            <div>
              <Label htmlFor="title">Examination Title</Label>
              <Input
                type="text"
                placeholder="e.g. Discipleship Manual I Exam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Examination Date */}
            <div className="mb-4">
              <Label htmlFor="date">Examination Date</Label>
              <DatePicker date={date} setDate={setDate} />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 mt-9">
              <Button
                type="submit"
                className="w-full bg-neutral-600 text-white hover:bg-neutral-600/90"
                disabled={getCreateExamStatus === "executing"}
              >
                {getCreateExamStatus === "executing" ? (
                  <Loader className="animate-spin text-sm mx-4" />
                ) : (
                  "Create Examination"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
