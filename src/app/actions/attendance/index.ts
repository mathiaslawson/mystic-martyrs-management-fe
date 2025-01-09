"use server";
import { getServerSideCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import {
  AttendanceRecords,
  CellMembers,
  GeneralCellStat,
  MemberAbscence,
  RecordAttendance,
  SingleMemberStat,
} from "@/schemas/attendance";
import { flattenValidationErrors } from "next-safe-action";

const getAuthHeader = async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log("this is token", token.cookie);
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token.cookie}`;
};

// record attendace
export const recordAttendance = actionClient
  .schema(RecordAttendance, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id, member_id, date, is_present } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/cells/record-attendance`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cell_id,
          member_id,
          date,
          is_present,
        }),
      }
    );
    return response.json();
  });

// attendance records
export const attendanceRecords = actionClient
  .schema(AttendanceRecords, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/cells/get-attendance-stats`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cell_id,
        }),
      }
    );
    return response.json();
  });

//   singlememberStat
export const singleMemberStats = actionClient
  .schema(SingleMemberStat, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { member_id } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/cells/member/${member_id}/stats`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  });

//   generalcellstat
export const generalCellStat = actionClient
  .schema(GeneralCellStat, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/cells/${cell_id}/stats`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      
      }
    );

    console.log('stat reports')

    return response.json();
  });

// MemberAbscence
export const memberAbscenceStat = actionClient
  .schema(MemberAbscence, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { member_id } }) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/cells/member/${member_id}/absences`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  });

// members for scpefici cell
export const getCellMembers = actionClient
  .schema(CellMembers, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id } }) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/cells/cell-members/${cell_id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response, "thi response");

    return response.json();
  });
