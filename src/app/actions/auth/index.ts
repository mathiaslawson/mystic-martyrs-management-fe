"use server"

import { getCookie } from "@/lib/get-cookie"
import { actionClient } from "@/lib/safe-action"
import { LoginAuthSchema, RegisterAuthSchema } from "@/schemas/auth"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from 'next/headers'



export const loginUserAction = actionClient
  .schema(LoginAuthSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email, password } }) => {
    const response = await fetch(
      `https://churchbackend-management.onrender.com/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    if (data) {
      // Set the cookie with the access token
      const cookie = cookies();
      cookie.set("access_token", data.data.access_token, {
        httpOnly: true, // Prevents client-side access
        secure: process.env.NODE_ENV === "production", // Set to true in production
        maxAge: 60 * 60, // 1 hour
        path: "/", // Accessible across your site
      });
    }

    return data;
  });


export const signUpUserAction = actionClient
  .schema(RegisterAuthSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async({ parsedInput: { email, password, role, firstname, lastname  } }) => {
    const response = await fetch(
      `https://churchbackend-management.onrender.com/api/v1/auth/register`,
      {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstname: firstname,
          lastname: lastname,
          role: role,
        }),
      }
    );

    return response.json();
  });


// check session 
export const checkSessionAction = actionClient.action(async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value; 
  if (!token) {
    throw new Error("User not authenticated"); 
  }
  // Now you can use the token in your fetch request
  const response = await fetch(
    `https://churchbackend-management.onrender.com/api/v1/auth/me`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Session check failed"); 
  }
  return await response.json();
});


// get all members 
export const getAllMembersAction = actionClient.action(async () => {
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
   return response.json();
});


// get all members 
export const getAccountDataAction = actionClient.action(async () => {
  const response = await fetch(
    `https://churchbackend-management.onrender.com/api/v1/auth/me`,
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
