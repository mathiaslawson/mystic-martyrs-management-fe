"use server";

import { getCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";

const baseUrl = `https://mystic-be.vercel.app/`;
const token = getCookie("access_token");
export const getAccountDataAction = async () => {
  
  console.log(token);
  if (!token) {
    throw new Error("No token found. Please log in again.");
  }

  const response = await fetch(`${baseUrl}api/v1/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to fetch user data.");
  }
  console.log(response);
  return response.json();
};

// get all members
export const getAllMembersAction = actionClient.action(async () => {
  const response = await fetch(
    `https://churchbackend-management.onrender.com/api/v1/users`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
});