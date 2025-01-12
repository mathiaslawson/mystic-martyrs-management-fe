"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  memberAbscenceStat,
  singleMemberStats,
} from "@/app/actions/attendance";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AttendanceStats } from "./abscence-stats";
import { AbsenceList } from "./abscence-list";

interface MemberStatsDialogProps {
  memberId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AttendanceStatsData {
  totalDays: number;
  presentDays: number;
  attendancePercentage: number;
}

interface Absence {
  date: string;
  remarks: string;
}

export function MemberStatsDialog({
  memberId,
  open,
  onOpenChange,
}: MemberStatsDialogProps) {
  const [attendanceStats, setAttendanceStats] =
    useState<AttendanceStatsData | null>(null);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    execute: getAbscent,
    status: abscentLoading,
    result: abscentResult,
  } = useAction(memberAbscenceStat);

  const {
    execute: getSingleStat,
    status: singleStatLoading,
    result: singleStatResult,
  } = useAction(singleMemberStats);

  useEffect(() => {
    if (memberId) {
      setIsLoading(true);
      setError(null);
      getSingleStat({ member_id: memberId });
      getAbscent({ member_id: memberId });
    }
  }, [getSingleStat, memberId, getAbscent]);

  useEffect(() => {
    if (singleStatLoading === "hasSucceeded" && singleStatResult?.data?.data) {
      setAttendanceStats(singleStatResult?.data?.data);
    } else if (singleStatLoading === "hasErrored") {
      setError("Failed to load attendance stats");
    }
  }, [singleStatLoading, singleStatResult]);

  useEffect(() => {
    if (abscentLoading === "hasSucceeded" && abscentResult?.data?.data) {
      setAbsences(abscentResult?.data?.data);
    } else if (abscentLoading === "hasErrored") {
      setError((prevError) =>
        prevError
          ? `${prevError}, Failed to load absences`
          : "Failed to load absences"
      );
    }
  }, [abscentLoading, abscentResult]);

  useEffect(() => {
    if (singleStatLoading !== "executing" && abscentLoading !== "executing") {
      setIsLoading(false);
    }
  }, [singleStatLoading, abscentLoading]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cell Member Attendace Statistics</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <p>Loading...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <AttendanceStats stats={attendanceStats} />
            <AbsenceList absences={absences} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
