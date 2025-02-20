import {z} from "zod";
export const createExamination = z.object({
    cell_id: z.string(),
    title: z.string(),
    date: z.string(),
    member_id : z.string()
})