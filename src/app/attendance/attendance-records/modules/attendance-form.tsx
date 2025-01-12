"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { useAction } from "next-safe-action/hooks";
import { getCellMembers, recordAttendance } from "@/app/actions/attendance";
import { toast } from "sonner";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";

interface Member {
  member_id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

// interface CellData {
//   data: {
//     success: boolean;
//     message: string;
//     data: {
//       cell_id: string;
//       members: Member[];
//     };
//   };
// }

interface SelectOption {
  value: string;
  label: string;
}

export function AttendanceForm() {
  const [date, setDate] = useState< undefined | Date>(new Date());
  const [isPresent, setIsPresent] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SelectOption | null>(null);
  const [members, setMembers] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<SelectOption[]>([]);

  const { me } = useAuthMemberStore();
  const cell_id = me?.data.role === "CELL_LEADER" ? me?.data.member?.cell_id : "";

  // Fetch members when component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      if (!cell_id) return;
      
      setIsLoading(true);
      try {
        const response = await getCellMembers({ cell_id });
        
        if (response?.data?.success && response.data.data.members) {
          const memberOptions = response.data.data.members
            // .filter(member => member.role !== "CELL_LEADER") 
            .map((member: Member) => ({
              value: member.member_id,
              label: `${member.firstname} ${member.lastname}`,
            }));
          setMembers(memberOptions);
          setFilteredMembers(memberOptions);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load members");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [cell_id]);

  const { execute: recordAttend, status: recordStatus } = useAction(
    recordAttendance,
    {
      onSuccess: () => {
        toast.success("Attendance recorded successfully");
        setDate(new Date());
        setIsPresent(false);
        setSelectedMember(null);
      },
      onError: (error) => {
        toast.error(`Error recording attendance: ${error.error}`);
      },
    }
  );

  // Handle search input
  const handleSearchInput = (inputValue: string) => {
    const filtered = members.filter(member =>
      member.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedMember || !date || !cell_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    const attendanceData = {
      cell_id,
      member_id: selectedMember.value,
      date: date.toISOString(),
      is_present: isPresent,
    };

    try {
       recordAttend(attendanceData);
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <Card className="w-full max-w-full mx-auto">
      <CardHeader>
        <CardTitle>Record Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">Select Member</Label>
            <Select
              id="member"
              isLoading={isLoading}
              options={filteredMembers}
              value={selectedMember}
              onChange={setSelectedMember}
              onInputChange={handleSearchInput}
              isDisabled={!cell_id || isLoading}
              placeholder="Search for a member..."
              className="text-sm"
              classNamePrefix="select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: 'black',
                  primary25: '#f3f4f6',
                  primary50: '#e5e7eb',
                },
              })}
              noOptionsMessage={() => "No members found"}
            />
            {!cell_id && (
              <p className="text-sm text-red-500">
                You must be a cell leader to record attendance
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <DatePicker date={date} setDate={setDate} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is-present"
              checked={isPresent}
              onCheckedChange={setIsPresent}
            />
            <Label htmlFor="is-present">Present</Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 text-white"
            disabled={!selectedMember || !date || !cell_id || recordStatus === "executing"}
          >
            {recordStatus === "executing" ? "Recording..." : "Submit Attendance"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}