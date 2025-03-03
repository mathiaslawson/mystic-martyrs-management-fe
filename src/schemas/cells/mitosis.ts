import { z } from "zod";

export const divideCell = z.object({
    cell_id: z.string(), 
    new_cell_name: z.string(), 
    reason: z.string()
});



export const mitosisHistory = z.object({
  cell_id: z.string(),
});

export const divisionLevel = z.object({
  cell_id: z.string(),
});

export const subCells = z.object({
  cell_id: z.string(),
});