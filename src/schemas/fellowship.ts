import { z } from "zod";

export const FellowshipByID = z.object({
  id: z.string(),
});

export const UpdateFellowship = z.object({
  fellowship_name: z.string(),
  id: z.string(),
  fellowship_leader_id: z.string(),
});

export const CreateFellowship = z.object({
  fellowship_name: z.string(),
  zone_id: z.string(),
  fellowship_leader_id: z.string(),
});

export type FellowshipByID = z.infer<typeof FellowshipByID>;
export type UpdateFellowship = z.infer<typeof UpdateFellowship>;
export type CreateFellowship = z.infer<typeof CreateFellowship>;
