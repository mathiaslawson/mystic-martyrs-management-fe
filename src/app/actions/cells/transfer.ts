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

const baseUrl = `https://mystic-be.vercel.app/`;

//Create a transfer
const token = getServerSideCookie({ cookieName: "access_token" });

export const transferMember = actionClient
  .schema(CreateTransfer, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: { member_id, new_cell_id, new_status, remarks },
    }) => {
      try {
        const response = await fetch(
          `${baseUrl}api/v1/cells/transfer/create-transfer`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${(await token).cookie}`,
              "Content-Type": "application/json", // Ensure the backend knows the request body is JSON
            },
            body: JSON.stringify({
              member_id,
              new_cell_id,
              new_status,
              remarks,
            }),
          }
        );

        // Parse the response body
        const data = await response.json();
        console.log("API Response:", data);

        // Check if the response indicates success
        if (!response.ok) {
          throw new Error(data.message || "Failed to transfer member");
        }

        return data; // Return the response data for further handling
      } catch (error) {
        console.error("API Error:", error);
        throw error; // Re-throw the error to be handled by the caller
      }
    }
  );

export const getTransferHistory = actionClient
  .schema(getTransferHistoryTypes, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { member_id, start_date, end_date, cell_id } }) => {
      const response = await fetch(
        `${baseUrl}cells/transfer/transfer-history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${(await token).cookie}`,
          },
          body: JSON.stringify({
            member_id,
            start_date,
            end_date,
            cell_id,
          }),
        }
      );

      console.log(response);
    }
  );

export const changeMemberStatus = actionClient
  .schema(ChangeMemberStatus, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { member_id, remarks, new_status } }) => {
    const response = await fetch(
      `${baseUrl}cells/transfer/change-member-status`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(await token).cookie}`,
        },
        body: JSON.stringify({
          member_id,
          remarks,
          new_status,
        }),
      }
    );
    console.log(response);
  });

export const transferHistoryByMemberId = actionClient
  .schema(TransferHistoryByMemberId, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { member_id } }) => {
    const response = await fetch(
      `${baseUrl}cells/transfer/member-transfer-history`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(await token).cookie}`,
        },
        body: JSON.stringify({
          member_id,
        }),
      }
    );

    console.log(response);
  });
