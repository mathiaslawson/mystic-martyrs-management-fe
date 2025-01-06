import { z } from 'zod'

export const LoginAuthSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string(),
})

export const RegisterAuthSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.enum([
    "ZONE_LEADER",
    "FELLOWSHIP_LEADER",
    "CELL_LEADER",
    "MEMBER",
    "ADMIN",
  ]),
});

export const GenerateInvitationSchema = z.object({
  cellId: z.string().optional(),
  fellowshipId: z.string().optional(),
  zoneId: z.string().optional(),
  member_id: z.string(),
  role: z.string(),
});

export type LoginAuth = z.infer<typeof LoginAuthSchema>;
export type RegisterAuth = z.infer<typeof RegisterAuthSchema>
export type GenerateInvite = z.infer<typeof GenerateInvitationSchema>