"use server";
import { getCookie } from "@/lib/get-cookie";
import { actionClient } from "@/lib/safe-action";
import { CellByID, CreateCell, UpdateCell } from "@/schemas/cells";
import { flattenValidationErrors } from "next-safe-action";

// get all cells
export const getAllCells = actionClient.action(async () => {
  if (!getCookie()) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(
    `https://churchbackend-management.onrender.com/api/v1/cells`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${getCookie()}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Session check failed");
  }

  return await response.json();
});

//getFellowship by ID
export const getCellsByID = actionClient
  .schema(CellByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const response = await fetch(
      `https://churchbackend-management.onrender.com/api/v1/cells/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie()}`,
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
  .action(async ({ parsedInput: { id, cell_leader_id, cell_name} }) => {
    const response = await fetch(
      `https://churchbackend-management.onrender.com/api/v1/cells/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cell_leader_id,
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
    const response = await fetch(
      `https://churchbackend-management.onrender.com/api/v1/cells/${id}`,
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


// create cell
export const addCell = actionClient
  .schema(CreateCell, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { cell_name, fellowship_id, cell_leader_id } }) => {
      const response = await fetch(
        `https://churchbackend-management.onrender.com/api/v1/cells`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              cell_leader_id, 
              cell_name, 
              fellowship_id
          }),
        }
      );
      return response.json();
    }
  );


//   get cell leaders
export const getCellLeaders = actionClient.action(async () => {
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

  console.log(data, "the data that came out");

  const cellLeaders = data?.data?.filter(
    (item: { role: string }) => item.role === "CELL_LEADER"
  );

  return cellLeaders;
});
