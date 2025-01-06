"use server";


import { getServerSideCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";

const baseUrl = `https://mystic-be.vercel.app/`;

// export const getAccountDataAction = actionClient.action(async () => {
//   console.log('init get account action')
//   const token = await getServerSideCookie({cookieName: "access_token"});

//   const response = await fetch(`${baseUrl}api/v1/auth/me`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token.cookie}`
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData?.message || "Failed to fetch user data.");
//   }

//   return response.json();
// });


export const getAccountDataAction = actionClient.action(async (): Promise<unknown> => {
  console.log("init get account action");
  const token = await getServerSideCookie({ cookieName: "access_token" });

  const response = await fetch(`${baseUrl}api/v1/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.cookie}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to fetch user data.");
  }

  return response.json(); // Response typed as `unknown`
});


export const getAllMembersAction = actionClient.action(async () => {
 const token = getServerSideCookie({ cookieName: "access_token" });

  if (!token) {
    throw new Error("No token found. Please log in again.");
  }

  const response = await fetch(
    `https://churchbackend-management.onrender.com/api/v1/users`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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

