"use client"
import React, { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Select from "react-select";
import { getAllCells } from "../../components/@Global/actions/cells";
import { Options, RoleOptions } from "./types";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";
import { generateInviteCode } from "../../components/@Global/actions/auth";
import InviteCodeDialog from "./inviteCodeDialogue";
import { Label } from "@/components/ui/label";

// 
export default  function AddCellModal() {
  // const [isOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleOptions | null>(null);
  const [cellOptions, setCellOptions] = useState<Options[]>([]);
  const [selectedCell, setSelectedCell] = useState<Options | null>(null);

  // Fetch data actions (cells, fellowships, zones)
  const { execute: executeGetCells, status: getCellStatus, result: cellResult } = useAction(getAllCells);
  const { execute: executeGen, status: genStat, result: genRes } = useAction(generateInviteCode);

  useEffect(() => {
    executeGetCells(); // Fetch cells on mount
  }, [executeGetCells]);

  
  
  // Update cell options when cell data is fetched
  useEffect(() => {
    if (cellResult?.data) {
      const options = cellResult.data.data.map((cell: { 
        cell_id: string; 
        cell_name: string; 
        fellowship_id: string; 
        zone_id: string 
      }) => ({
        value: cell.cell_id,
        label: cell.cell_name,
        fellowshipId: cell.fellowship_id,
        zoneId: cell.zone_id,
      }));
      setCellOptions(options);
    }
  }, [cellResult]);

  const { me } = useAuthMemberStore();
  const member_id = me?.data.member.member_id;


  const roleOptions: RoleOptions[] = [
    {
      value: "MEMBER",
      label: "Member",
    },
    {
      value: "ZONE_LEADER",
      label: "Zone Leader",
    },
    {
      value: "CELL_LEADER",
      label: "Cell Leader",
    },
    {
      value: "FELLOWSHIP_LEADER",
      label: "Fellowship Leader",
    },
    {
      value: "ADMIN",
      label: "Admin",
    },
  ];

  // type Role = "MEMBER" | "ZONE_LEADER" | "CELL_LEADER" | "FELLOWSHIP_LEADER" | "ADMIN";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCell || !selectedRole) {
      console.error("Cell and Role are required.");
      return;
    }

    // Extract fellowshipId and zoneId directly from the selected cell
    const fellowship_id = selectedCell.fellowship_id;
    // const zone_id = selectedCell.zone_id;

    executeGen({
      cell_id: selectedCell.value,
      role: selectedRole.value,
      fellowship_id,
      member_id: member_id as string,
    });
  };

  return (
    <div className="mx-auto w-[550px] mt-[100px]">
      <h1 className="text-3xl font-semibold">Invitation</h1>
      <p className="font-DMSans md:w-4/4 text-justify mb-5">
        Please select the appropriate parameters for the invite you want to generate.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="role_id">Role</Label>
          <Select
            id="role_id"
            options={roleOptions} // Use full roleOptions (adjust filtering if needed)
            value={selectedRole}
            onChange={(newValue) => setSelectedRole(newValue as Options)}
            placeholder="Select Role"
          />
        </div>

        <div>
          <Label htmlFor="cell_id">Cell</Label>
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

        <div className="flex gap-2 mt-4">
          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-600/90"
            disabled={getCellStatus === "executing" || genStat === "executing"}
          >
            {genStat === "executing" && <Loader className="animate-spin text-sm mx-4" />}
            Generate Invitation Link
          </Button>
        </div>
      </form>

      <InviteCodeDialog genRes={genRes?.data?.data} genStat={genStat} />
    </div>
  );
}
