"use server";
import { actionClient } from "@/lib/safe-action";
import { getServerSideCookie } from "@/lib/get-cookie";
import { flattenValidationErrors } from "next-safe-action";
import { fullPerformanceMetrics } from "@/schemas/cells/performance";

const baseUrl = `https://mystic-be.vercel.app/`;
const token = getServerSideCookie({ cookieName: "access_token" });


export const getFullCellPerformanceMetrics = actionClient
  .schema(fullPerformanceMetrics, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { start_date, end_date, cell_id } }) => {
      const response = await fetch(
        `${baseUrl}cells/performace/performance-analyics`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${(await token).cookie}`,
          },
          body: JSON.stringify({
            start_date,
            end_date,
            cell_id,
          }),
        }
      );

      console.log(response);
    }
  );

