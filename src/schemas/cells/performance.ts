import { z } from "zod";

export const fullPerformanceMetrics = z.object({
  start_date: z.preprocess((val) => new Date(val as string), z.date()),
  end_date: z.preprocess((val) => new Date(val as string), z.date()),
  cell_id: z.string().optional(), 
});
