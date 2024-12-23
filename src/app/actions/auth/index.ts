"use server";

import { getCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import { cookies } from "next/headers";



const baseUrl = `https://mystic-be.vercel.app/`;

export const fireOAuthAction = async () => {
  try {
    const response = await fetch(`${baseUrl}api/v1/auth/invite/04027a3d-ba5e-4c40-91e5-58f651cedc5d`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to log in.");
    }

    const data = await response.json();

    // Save the access token in cookies
    const cookieStore = cookies();
    cookieStore.set("access_token", data.access_token);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("OAuth login error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "An unknown error occurred.");
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};


export const checkSessionAction = actionClient.action(async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
    if (!token) {
      throw new Error("User not authenticated");
    }
  });

//   const response = await fetch(
//     `${baseUrl}api/v1/auth/me`,
//     {
//       method: "GET",
//       credentials: "include",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   if (!response.ok) {
//     throw new Error("Session check failed");
//   }
//   return await response.json();
// });

// export const getAllMembersAction = actionClient.action(async () => {
//   const response = await fetch(
//     `${baseUrl}api/v1/users`,
//     {
//       method: "GET",
//       credentials: "include",
//       headers: {
//         Authorization: `Bearer ${getCookie()}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   return response.json();
// });

export const getAccountDataAction = actionClient.action(async () => {
  const response = await fetch(
    `${baseUrl}api/v1/auth/me`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${getCookie()}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
});
