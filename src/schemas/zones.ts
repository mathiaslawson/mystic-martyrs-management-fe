import { z } from "zod";

export const ZoneByID = z.object({
  id: z.string()
});

export type ZoneByID = z.infer<typeof ZoneByID>;

