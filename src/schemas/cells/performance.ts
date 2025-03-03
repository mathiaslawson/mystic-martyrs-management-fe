import { z } from "zod";

export const fullPerformanceMetrics = z.object({
  cell_id: z.string().nullable(),
  start_date: z.string(),
  end_date: z.string(),
});
