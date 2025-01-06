"use client";

import { useState, useEffect, useCallback } from "react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import Select from "react-select";
import { addCell, getAllCells } from "../actions/cells";
import { getAllFellowships } from "../actions/fellowships";
import { withAuth } from "@/components/hoc/withAuth";
import { Options } from "./types";
import { getAllZones } from "../actions/zones";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";
import { generateInviteCode } from "../actions/auth";
import InviteCodeDialog from "./inviteCodeDialogue";

function AddCellModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [cellName, setCellName] = useState("");

  const [selectedFellowship, setSelectedFellowship] = useState<Options | null>(
    null
  );

  const [selectedRole, setSelectedRole] = useState<Options | null>(null);

  const [fellowshipOptions, setFellowshipOptions] = useState<Options[]>([]);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  // cells
  const [cellOptions, setCellOptions] = useState<Options[]>([]);
  const [selectedCell, setSelectedCell] = useState<Options | null>(null);

  // zones
  const [zoneOptions, setZoneOptions] = useState<Options[]>([]);
  const [selectedZone, setSelectedZone] = useState<Options | null>(null);

  const {
    execute: executeGetFellowships,
    status: getFellowshipsStatus,
    result: fellowshipsResult,
  } = useAction(getAllFellowships);
  const {
    execute: executeGetCells,
    status: getCellStatus,
    result: cellResult,
  } = useAction(getAllCells);
  const {
    execute: executeGetZones,
    status: getZoneStatus,
    result: zoneResult,
  } = useAction(getAllZones);
  const {
    execute: executeGen,
    status: genStat,
    result: genRes,
  } = useAction(generateInviteCode);

  useEffect(() => {
    executeGetCells();
    executeGetFellowships();
    executeGetZones();
  }, [isOpen, executeGetCells, executeGetFellowships]);

  const roleOptions: Options[] = [
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

  useEffect(() => {
    // fellowship
    if (fellowshipsResult?.data) {
      const options = fellowshipsResult?.data?.data?.map(
        (fellowship: { fellowship_id: string; fellowship_name: string }) => ({
          value: fellowship.fellowship_id,
          label: fellowship.fellowship_name,
        })
      );
      setFellowshipOptions(options);
    }
    // cell
    if (cellResult?.data) {
      const options = cellResult?.data?.data?.map(
        (cell: { cell_id: string; cell_name: string }) => ({
          value: cell.cell_id,
          label: cell.cell_name,
        })
      );
      setCellOptions(options);
      // zones
      if (zoneResult?.data) {
        const options = zoneResult?.data?.data?.map(
          (zone: { zone_id: string; zone_name: string }) => ({
            value: zone.zone_id,
            label: zone.zone_name,
          })
        );
        setZoneOptions(options);
      }
    }
  }, [fellowshipsResult, cellResult, zoneResult]);

  const { me } = useAuthMemberStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const member_id = me?.data.member.member_id;

    executeGen({
      cellId: selectedCell?.value,
      role: selectedRole?.value as string,
      fellowshipId: selectedFellowship?.value,
      member_id: member_id as string,
      zoneId: selectedZone?.value,
    });
  };

  useEffect(() => {
    const inviteLink = genRes?.data?.inviteLink;
    console.log("inint", inviteLink);

    if (genStat === "hasSucceeded" && genRes) {
      console.log(genRes, "okay okay");
      const inviteLink = genRes?.data?.data?.inviteLink;
      const match = inviteLink?.match(/inviteCode=([\w-]+)/);
      
      const inviteCode = match ? match[1] : null;

      if (inviteCode) {
        console.log("Extracted UUID:", inviteCode);
        setSelectedCell(null)
        setSelectedRole(null)
        setSelectedFellowship(null)
        setSelectedZone(null)
      } else {
        console.warn("Invite code not found in the URL.");
      }
    } 
  }, [genRes]);

  return (
    <div className="mx-auto w-[550px] mt-[100px]">
      <h1 className="text-3xl font-semibold">Invitation</h1>
      <p className="font-DMSans md:w-4/4 text-justify mb-5">
        Please select the appropriate parameters for the invite you want to
        generate.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="role_id">Role</Label>
          <Select
            id="role_id"
            options={roleOptions}
            value={selectedRole}
            onChange={(newValue) => {
              setSelectedRole(newValue as Options);
              setSelectedFellowship(null);
              setSelectedCell(null);
              setSelectedZone(null);
            }}
            placeholder="Select Role"
          />
        </div>

        {selectedRole?.value === "CELL_LEADER" ? (
          <>
            <div>
              <Label htmlFor="fellowship_id">Cell Leader</Label>
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
            <div className="mb-10 mt-10">
              <b>Note:</b> When this link is generated, individual who use it
              would be able to gain Adminstrative Cell access to the associate
              zone selected.
            </div>
          </>
        ) : selectedRole?.value === "FELLOWSHIP_LEADER" ? (
          <>
            <div>
              <Label htmlFor="fellowship_id">Fellowship</Label>
              <Select
                id="fellowship_id"
                options={fellowshipOptions}
                value={selectedFellowship}
                onChange={(newValue) =>
                  setSelectedFellowship(newValue as Options)
                }
                placeholder="Select Fellowship"
                isLoading={getFellowshipsStatus === "executing"}
                isDisabled={getFellowshipsStatus === "executing"}
              />
            </div>
            <div className="mb-10 mt-10">
              <b>Note:</b> When this link is generated, individual who use it
              would be able to gain Adminstrative Fellowship access to the
              associate zone selected.
            </div>
          </>
        ) : selectedRole?.value === "ZONE_LEADER" ? (
          <>
            <div>
              <Label htmlFor="fellowship_id">Zone</Label>
              <Select
                id="zone_id"
                options={zoneOptions}
                value={selectedZone}
                onChange={(newValue) => setSelectedZone(newValue as Options)}
                placeholder="Select Zone"
                isLoading={getZoneStatus === "executing"}
                isDisabled={getZoneStatus === "executing"}
              />
            </div>
            <div className="mb-10 mt-10">
              <b>Note:</b> When this link is generated, individual who use it
              would be able to gain Adminstrative Zonal access to the associate
              zone selected.
            </div>
          </>
        ) : selectedRole?.value === "MEMBER" ? (
          <>
            <div>
              <Label htmlFor="cell_id">Cell</Label>
              <Select
                id="cell_id"
                options={fellowshipOptions}
                value={selectedFellowship}
                onChange={(newValue) =>
                  setSelectedFellowship(newValue as Options)
                }
                placeholder="Select Cell"
                isLoading={getFellowshipsStatus === "executing"}
                isDisabled={getFellowshipsStatus === "executing"}
              />
            </div>
            <div className="mb-10 mt-10">
              <b>Note:</b> When this link is generated, individual who use it
              would be able to gain join the associate cell selected.
            </div>
          </>
        ) : selectedRole?.value === "ADMIN" ? (
          <>
            <div className="mb-10 mt-10">
              <b>Note:</b> When this link is generated, individual who use it
              would be able to gain Adminstrative access over the system.
            </div>
          </>
        ) : (
          ""
        )}

        <div className="flex gap-2 mt-4">
          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-600/90"
            disabled={
              getCellStatus === "executing" ||
              getFellowshipsStatus === "executing" ||
              getZoneStatus === 'executing' || 
              genStat === 'executing'
            }
          >
           {genStat === 'executing' && <Loader className="animate-spin text-sm mx-4"/>} Generate Invitation Link
          </Button>
        </div>
      </form>

      <InviteCodeDialog genRes={genRes.data?.data} genStat={genStat} />

    </div>

    
  );
}

export default withAuth(AddCellModal);
