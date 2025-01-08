"use server";
import { getServerSideCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import { CreateZone, UpdateZone, ZoneByID } from "@/schemas/zones";
import { flattenValidationErrors } from "next-safe-action";


const getAuthHeader = async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log("this is token", token.cookie);
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token.cookie}`;
};



// Get all zones
export const getAllZones = actionClient.action(async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log('action triggered');
  const authHeader = await getAuthHeader();;
  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1/zones`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token.cookie}`, 
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Session check failed");
  }

  return await response.json();
});

// Get Zone by ID
export const getZoneByID = actionClient
  .schema(ZoneByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const authHeader = await getAuthHeader();;
    const response = await fetch(`https://mystic-be.vercel.app/api/v1/zones/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  });

// Update Zone
export const updateZone = actionClient
  .schema(UpdateZone, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id, zone_name, zone_location, zone_leader_id } }) => {
     const authHeader = await getAuthHeader();
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/zones/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: authHeader, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone_name: zone_name,
          zone_location: zone_location,
          zone_leader_id: zone_leader_id,
        }),
      }
    );
    return response.json();
  });

// Delete Zone
export const deleteZone = actionClient
  .schema(ZoneByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
     const authHeader = await getAuthHeader();
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/zones/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: authHeader, 
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  });

// Create Zone
export const addZone = actionClient
  .schema(CreateZone, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { zone_leader_id, zone_location, zone_name } }) => {
    
     const authHeader = await getAuthHeader();
     const token = await getServerSideCookie({ cookieName: "access_token" });

    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/zones`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token.cookie}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone_name: zone_name,
          zone_location: zone_location,
          zone_leader_id: zone_leader_id,
        }),
      }
    );
    return response.json();
  });

// Get Zone Leaders
export const getZoneLeaders = actionClient.action(async () => {
   const authHeader = await getAuthHeader();
  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1/users`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: authHeader, 
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  console.log(data, 'the data that came out');

  const zoneLeaders = data?.data?.filter((item: { role: string }) => item.role === "ZONE_LEADER");

  console.log(zoneLeaders, 'zone leaders');

  return zoneLeaders;
});
