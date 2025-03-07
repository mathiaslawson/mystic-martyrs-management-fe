"use server";
import { actionClient } from "@/lib/safe-action";
import { getServerSideCookie } from "@/lib/get-cookie";
import { flattenValidationErrors } from "next-safe-action";
import {
  divideCell as divideCellSchema,
    mitosisHistory,
  divisionLevel, 
  subCells
} from "@/schemas/cells/mitosis";

const baseUrl = `https://mystic-be.vercel.app/api/v1`;


const token = getServerSideCookie({ cookieName: "access_token" });

const getAuthHeader = async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log("this is token", token.cookie);
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token.cookie}`;
};
  

export const divideCell = actionClient
  .schema(divideCellSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id, new_cell_name, reason } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(`http://localhost:3000/api/v1/cells/mitosis/divide`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cell_id,
        new_cell_name,
        reason,
      }),
    });
    return response.json();
  });


export const getMitosisHistory = actionClient
  .schema(mitosisHistory, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { cell_id } }) => {
      const response = await fetch(`${baseUrl}/cells/mitosis/mitosis-history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${(await token).cookie}`,
        },
        body: JSON.stringify({
          cell_id,
        }),
      });

      console.log(response);
    }
  );

export const getDivisionLevel = actionClient
  .schema(divisionLevel, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id} }) => {
    const response = await fetch(
      `${baseUrl}/cells/mitosis/division-level`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(await token).cookie}`,
        },
        body: JSON.stringify({
         cell_id
        }),
      }
    );
    console.log(response);
  });

export const getSubCells = actionClient
  .schema(subCells, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id } }) => {
    const response = await fetch(`${baseUrl}/cells/mitosis/subcells`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(await token).cookie}`,
      },
      body: JSON.stringify({
        cell_id,
      }),
    });

    console.log(response);
  });
