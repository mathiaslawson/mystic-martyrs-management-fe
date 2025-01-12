"use server";
import { getServerSideCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import {
  CreateFellowship,
  FellowshipByID,
  UpdateFellowship,
} from "@/schemas/fellowship";
import { flattenValidationErrors } from "next-safe-action";

const getAuthHeader = async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log("this is token", token.cookie);
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token.cookie}`;
};

// Get all fellowships
export const getAllFellowships = actionClient.action(async () => {
  const authHeader = await getAuthHeader();
  console.log(authHeader, "this na authHeader");
  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1/fellowships`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("heii", response, "this is the fellwship reponse");

  if (!response.ok) {
    throw new Error("Session check failed");
  }

  return await response.json();
});


export const getDashItems = actionClient.action(async () => {
  const authHeader = await getAuthHeader();

  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1/users/dashboard`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(response, "this is thre respon dat");

  return await response.json();
});

// Get Fellowship by ID
export const getFellowshipByID = actionClient
  .schema(FellowshipByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/fellowships/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    return await response.json();
  });

// Update Fellowship
export const updateFellowship = actionClient
  .schema(UpdateFellowship, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id, fellowship_name } }) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/fellowships/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fellowship_name,
        }),
      }
    );

    return response.json();
  });

// Delete Fellowship
export const deleteFellowship = actionClient
  .schema(FellowshipByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/fellowships/${id}`,
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

// Create Fellowship
export const addFellowship = actionClient
  .schema(CreateFellowship, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: { fellowship_name, zone_id },
    }) => {
      const authHeader = await getAuthHeader();
      const response = await fetch(
        `https://mystic-be.vercel.app/api/v1/fellowships`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zone_id: zone_id,
            fellowship_name: fellowship_name,
          }),
        }
      );
      return response.json();
    }
  );

// Get Fellowship Leaders
export const getFellowshipLeaders = actionClient.action(async () => {
  const authHeader = await getAuthHeader();
  const response = await fetch(`https://mystic-be.vercel.app/api/v1/users`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  const fellowshipLeaders = data?.data?.filter(
    (item: { role: string }) => item.role === "FELLOWSHIP_LEADER"
  );

  return fellowshipLeaders;
});
