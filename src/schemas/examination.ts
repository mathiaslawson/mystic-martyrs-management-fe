import {z} from "zod";
export const createExamination = z.object({
    cell_id: z.string().nullable(),
    title: z.string(),
    date: z.date(),
    member_id : z.string()
})