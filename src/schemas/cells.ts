import { z } from "zod";

export const CellByID = z.object({
  id: z.string(),
});

export const UpdateCell = z.object({
  cell_name: z.string(),
  id: z.string(),
  cell_leader_id: z.string(),
});

export const CreateCell = z.object({
  cell_name: z.string(),
  cell_leader_id: z.string(),
  fellowship_id: z.string(),
});

export type CellByID = z.infer<typeof CellByID>;
export type UpdateCell = z.infer<typeof UpdateCell>;
export type CreateCell = z.infer<typeof CreateCell>;
