"use server"

import { actionClient } from "@/lib/safe-action"
import { LoginAuthSchema } from "@/schemas/auth"
import { flattenValidationErrors } from "next-safe-action"

export const loginUserAction = actionClient.schema(
    LoginAuthSchema,
    
    {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
    }
).metadata({
    actionName: "loginUserAction",
}).action(async({ parsedInput: { email, password }  }) => { 
   const response =  await fetch(`https://churchbackend-management.onrender.com/api/v1/auth/login`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify({
            email,
            password,
        })
    });
    
    return response.json();
})

export const signUpUserAction = actionClient
  .schema(LoginAuthSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email, password } }) => {
    await fetch(`https://churchbackend-management.onrender.com`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return { message: "Successfully logged in" };
  });