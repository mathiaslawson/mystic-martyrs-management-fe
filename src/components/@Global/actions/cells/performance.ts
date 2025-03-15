"use server";
import { actionClient } from "@/lib/safe-action";
import { getServerSideCookie } from "@/lib/get-cookie";
import { flattenValidationErrors } from "next-safe-action";
import { fullPerformanceMetrics } from "@/schemas/cells/performance";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000/api/v1`
    : `https://mystic-be.vercel.app/api/v1`;

const getAuthHeader = async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log("this is token", token.cookie);
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token.cookie}`;
};


export const getFullCellPerformanceMetrics = actionClient
  .schema(fullPerformanceMetrics, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { start_date, end_date, cell_id } }) => {

       const authHeader = await getAuthHeader();


      const response = await fetch(
        `${baseUrl}/cells/performace/performance-analyics`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_date,
            end_date,
            cell_id,
          }),
        }
      );

      console.log(response);
      return response.json()
    }
);
  
