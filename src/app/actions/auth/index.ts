"use server";

import { getServerSideCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import { GenerateInvitationSchema } from "@/schemas/auth";
import { flattenValidationErrors } from "next-safe-action";

const baseUrl = `https://mystic-be.vercel.app/`;

export const getAccountDataAction = actionClient.action(async () => {
  console.log("init get account action");
  const token = await getServerSideCookie({ cookieName: "access_token" });

  const response = await fetch(`${baseUrl}api/v1/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.cookie}`,
    },
  });

  if (response && response.status === 401) {
    throw new Error("User not Authenticated");
  }


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to fetch user data.");
  }

  return response.json();
});

export const generateInviteCode = actionClient
  .schema(GenerateInvitationSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { fellowshipId, zoneId, cellId, role , member_id} }) => {
    const token = await getServerSideCookie({ cookieName: "access_token" });

    const response = await fetch(`${baseUrl}invitations/generate`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token.cookie}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fellowshipId,
        zoneId,
        cellId,
        role,
        member_id
      }),
    });


    console.log(response, 'this is the response')

    return response.json();
  });

export const getAllMembersAction = actionClient.action(async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });


  if (!token) {
    throw new Error("No token found. Please log in again.");
  }


  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1/users`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.cookie}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {

    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to fetch members data.");
  }

  return response.json();
});

// export const loginAction = actionClient.action(async () => {
//   try {
//     const response = await fetch("https://mystic-be.vercel.app//api/v1/auth/invite", {
//       method: "GET",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to log in");
//     }

//     // return response.text();
//   } catch (error) {
//     console.error("Login error:", error);
//     throw error;
//   }
// });