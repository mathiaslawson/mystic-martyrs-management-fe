"use server";
import { getServerSideCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import { CellByID, CreateCell, UpdateCell } from "@/schemas/cells";
import { flattenValidationErrors } from "next-safe-action";

const getAuthHeader = async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log("this is token", token.cookie);
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token.cookie}`;
};

// get all cells
export const getAllCells = actionClient.action(async () => {
  const authHeader = await getAuthHeader();

  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1/cells`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    }
  );

console.log(response, 'wemeyy')


  return await response.json();
});

//get cells by ID
export const getCellsByID = actionClient
  .schema(CellByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `http://localhost:3000/api/v1/cells/${id}`,
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

// update Cell
export const updateCell = actionClient
  .schema(UpdateCell, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id, cell_name } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/cells/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cell_name,
          cell_id: id,
        }),
      }
    );
    return response.json();
  });

// delete cell
export const deleteCell = actionClient
  .schema(CellByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1//cells/${id}`,
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

// create cell
export const addCell = actionClient
  .schema(CreateCell, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { cell_name, fellowship_id } }) => {
      const authHeader = await getAuthHeader();

      const response = await fetch(
        `https://mystic-be.vercel.app/api/v1//cells`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cell_name,
            fellowship_id,
          }),
        }
      );
      return response.json();
    }
  );

//   get cell leaders
export const getCellLeaders = actionClient.action(async () => {
  const authHeader = await getAuthHeader();

  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1//users`,
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

  console.log(data, "the data that came out");

  const cellLeaders = data?.data?.filter(
    (item: { role: string }) => item.role === "CELL_LEADER"
  );

  return cellLeaders;
});


//get cell by zone ID
