import { z } from "zod";

export const createExaminationSchema = z.object({
  cell_id: z.string().nullable(),
  title: z.string(),
  date: z.date(),
  created_by_id: z.string(),
});

export const recordUpdateExamsResultSchema = z.object({
    exam_id: z.string(), 
    remarks: z.string(), 
    score: z.number(), 
    recorded_by: z.string(), 
    member_id: z.string(),
})

export const examResultsSchema = z.object({
    exam_id: z.string()
})

export const allExamsSchema = z.object({
    cell_id:z.string()
})