import { z } from "zod";

export const RecordAttendance = z.object({
  cell_id: z.string(),
  member_id: z.string(),
  date: z.string(),
  is_present: z.boolean(),
  remarks: z.string()
});

export const AttendanceRecords = z.object({
  cell_id: z.string(),
});

export const SingleMemberStat = z.object({
  member_id: z.string().optional(),
});

export const GeneralCellStat = z.object({
  cell_id: z.string(),
});

export const MemberAbscence = z.object({
  member_id: z.string().optional(),
});

export const CellMembers = z.object({
  cell_id: z.string(),
});

export type RecordAttendace = z.infer<typeof RecordAttendance>;
export type AttendanceRecords = z.infer<typeof AttendanceRecords>;
export type SingleMemberStat = z.infer<typeof SingleMemberStat>;
export type MemberAbscence = z.infer<typeof MemberAbscence>;

// cell-summary = [cell members, general cell stats]
//cell members stats= member[single member stat -> member_abscence]
// attendance records
