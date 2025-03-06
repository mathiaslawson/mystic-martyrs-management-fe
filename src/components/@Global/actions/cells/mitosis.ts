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

export const divideCell = actionClient
  .schema(divideCellSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: { cell_id, new_cell_name, reason },
    }) => {
      try {
        const response = await fetch(`${baseUrl}/cells/mitosis/divide`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(await token).cookie}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cell_id,
            new_cell_name,
            reason
          }),
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to Divide Cell");
        }

        return data;
      } catch (error) {
        console.error("API Error:", error);
        throw error; 
      }
    }
  );

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
