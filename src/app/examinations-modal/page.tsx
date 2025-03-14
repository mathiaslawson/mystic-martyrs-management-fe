"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { getAllCells } from "../../components/@Global/actions/cells";
import { Options } from "../invitation/types";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";

import { useAction } from "next-safe-action/hooks";
import { createExamination } from "../../components/@Global/actions/cells/examinations";

const Page = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [cellOptions, setCellOptions] = useState<Options[]>([]);
  const [selectedCell, setSelectedCell] = useState<Options | null>(null);
  const [title, setTitle] = useState<string>("");

  const {
    execute: executeGetCells,
    status: getCellStatus,
    result: cellResult,
  } = useAction(getAllCells);

  const { execute: executeCreateExams, status: getCreateExamStatus } =
    useAction(createExamination);

  useEffect(() => {
    executeGetCells();
  }, [executeGetCells]);

  useEffect(() => {
    if (cellResult?.data?.data && Array.isArray(cellResult.data.data)) {
      const options = cellResult.data.data.map(
        (cell: {
          cell_id: string;
          cell_name: string;
          fellowship_id: string;
          zone_id: string;
        }) => ({
          value: cell.cell_id,
          label: cell.cell_name,
          fellowshipId: cell.fellowship_id,
          zoneId: cell.zone_id,
        })
      );
      setCellOptions(options);
    } else {
      console.error(
        "cellResult.data.data is not an array:",
        cellResult?.data?.data
      );
      setCellOptions([]);
    }
  }, [cellResult]);

  const { me } = useAuthMemberStore();
  const member_id = me?.data.member.member_id || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date) {
      console.error("Title and date are required");
      return;
    }

    executeCreateExams({
      cell_id: selectedCell?.value || null,
      title,
      date,
      created_by_id: member_id,
    });
  };

  return (
    <div className="mx-auto w-[550px] mt-[100px] space-y-4">
      <h1 className="text-3xl font-semibold">Create Examination</h1>
      <p className="text-md text-gray-500">
        Please enter the details for the examination
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cell Selection */}
        <div>
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
        </div>

        {/* Examination Title */}
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
        <div>
          <Label htmlFor="date">Examination Date</Label>
          <DatePicker date={date} setDate={setDate} />
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 mt-4">
          <Button
            type="submit"
            className="w-full bg-purple-600 text-white hover:bg-purple-600/90"
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
  );
};

export default Page;
