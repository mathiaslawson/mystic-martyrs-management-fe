"use server";
import { actionClient } from "@/lib/safe-action";
import { getServerSideCookie } from "@/lib/get-cookie";
import { flattenValidationErrors } from "next-safe-action";
import {
  CreateTransfer,
  getTransferHistoryTypes,
  ChangeMemberStatus,
  TransferHistoryByMemberId,
} from "@/schemas/cells/transfer";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000/`
    : `https://mystic-be.vercel.app/`;

const getAuthHeader = async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log("this is token", token.cookie);
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token.cookie}`;
};

export const transferMember = actionClient
  .schema(CreateTransfer, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { member_id, new_cell_id, remarks } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `${baseUrl}api/v1/cells/transfer/create-transfer`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_id,
          new_cell_id,
          remarks,
        }),
      }
    );

    console.log(response, "this is the response");

    return await response.json();
  });

export const getTransferHistory = actionClient
  .schema(getTransferHistoryTypes, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { member_id, start_date, end_date, cell_id } }) => {
      try {
        const authHeader = await getAuthHeader();

        const response = await fetch(
          `${baseUrl}cells/transfer/transfer-history`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              member_id,
              start_date,
              end_date,
              cell_id,
            }),
          }
        );

        console.log(response.json(), "this is the respons sign");
        return response.json();
      } catch (error) {
        console.log(error, "this na error");
      }
    }
  );

export const changeCellMemberStatus = actionClient
  .schema(ChangeMemberStatus, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { member_id, remarks, new_status } }) => {
    const authHeader = await getAuthHeader();

    try {
      const response = await fetch(
        `${baseUrl}api/v1/cells/transfer/change-member-status`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            member_id,
            remarks,
            new_status,
          }),
        }
      );

      console.log(response, "this is the response");

      return await response.json();
    } catch (e) {
      console.log(e, "this na error");
      return e;
      
  }
  });

export const transferHistoryByMemberId = actionClient
  .schema(TransferHistoryByMemberId, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { member_id } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `${baseUrl}api/v1/cells/transfer/member-transfer-history`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_id,
        }),
      }
    );

    console.log(response, "this is the respons sign");
    
    return response.json();
  });

