import { z } from "zod";

export const ZoneByID = z.object({
  id: z.string()
});

export const UpdateZone = z.object({
  zone_name: z.string(),
  id: z.string(), 
  zone_location: z.string(),
  zone_leader_id: z.string(),
});

export const CreateZone = z.object({
  zone_name: z.string(),
  zone_location: z.string(),
  zone_leader_id: z.string(),
});

export type ZoneByID = z.infer<typeof ZoneByID>;
export type UpdateZone = z.infer<typeof UpdateZone>;
export type CreateZone = z.infer<typeof CreateZone>;

