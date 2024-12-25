"use server";

import { getCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";

const baseUrl = `https://mystic-be.vercel.app/`;

export const getAccountDataAction = async () => {
  const token = getCookie("access_token");
  console.log(token);
  if (!token) {
    throw new Error("No token found. Please log in again.");
  }

  const response = await fetch(`${baseUrl}api/v1/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlbGFzaXNlcGVudTVAZ21haWwuY29tIiwic3ViIjoiMWNkZDg2NzktNWYxOS00ZDkyLWFkZjUtYWZkZWI0Yzg0ZDZjIiwicm9sZSI6IlpPTkVfTEVBREVSIiwiaWF0IjoxNzM1MTY1MzE4LCJleHAiOjE3MzUxNjg5MTh9.3hY90kpasGRWduchA9mPy9c1qx57UnD6toBqxdzdzPk",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to fetch user data.");
  }
  console.log(response);
  return response.json();
};
