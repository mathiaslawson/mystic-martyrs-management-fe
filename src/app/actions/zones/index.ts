"use server";
import { getCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import { ZoneByID } from "@/schemas/zones";
import { flattenValidationErrors } from "next-safe-action";


// get all zones
export const getAllZones = actionClient.action(async () => {
 console.log('action triggered')
  if (!getCookie()) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(
    `https://churchbackend-management.onrender.com/api/v1/zones`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${getCookie()}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Session check failed");
  }

  return await response.json();
});

export const getZoneByID = actionClient
  .schema(ZoneByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const response = await fetch(`https://churchbackend-management.onrender.com/api/v1/zones/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${getCookie()}`,
        "Content-Type": "application/json",
      },
    });

   return await response.json();
  });