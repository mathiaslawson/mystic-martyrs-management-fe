"use server";
import { getCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import { CreateZone, UpdateZone, ZoneByID } from "@/schemas/zones";
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
        Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlbGFzaXNlcGVudTVAZ21haWwuY29tIiwic3ViIjoiMWNkZDg2NzktNWYxOS00ZDkyLWFkZjUtYWZkZWI0Yzg0ZDZjIiwicm9sZSI6IlpPTkVfTEVBREVSIiwiaWF0IjoxNzM0OTEwMTg2LCJleHAiOjE3MzQ5MTM3ODZ9.tdGKMb29hKdJS5L4rGxFrPdYWckSeHzYuUTqTfbScos",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Session check failed");
  }

  return await response.json();
});


//getzoneby ID
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


// update Zone
export const updateZone = actionClient
  .schema(UpdateZone, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id , zone_name, zone_location, zone_leader_id } }) => {
    const response = await fetch(
      `https://churchbackend-management.onrender.com/api/v1/zones/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone_name: zone_name,
          zone_location: zone_location,
          zone_leader_id: zone_leader_id,
        }),
      }
    );
    return response.json()
  });


    // update Zone
export const deleteZone = actionClient
  .schema(ZoneByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const response = await fetch(
      `https://churchbackend-management.onrender.com/api/v1/zones/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie()}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  });

// create zone
  export const addZone = actionClient
    .schema(CreateZone, {
      handleValidationErrorsShape: (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({ parsedInput: { zone_leader_id, zone_location, zone_name } }) => {
      const response = await fetch(
        `https://churchbackend-management.onrender.com/api/v1/zones`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie()}`,
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
  

export const getZoneLeaders = actionClient.action(async () => {
  const response = await fetch(
    `https://churchbackend-management.onrender.com/api/v1/users`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${getCookie()}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  console.log(data, 'the data that came out')

 
  const zoneLeaders = data?.data?.filter((item: { role: string }) => item.role === "ZONE_LEADER");

  console.log(zoneLeaders, 'za data')
  
  return zoneLeaders;
});
