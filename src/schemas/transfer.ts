import { z } from "zod";

export const CreateTransfer = z.object({
  member_id: z.string(),
  new_cell_id: z.string(),
  new_status: z.enum(["ACTIVE", "INACTIVE", "TRANSFERRED", "LEFT"]),
  remarks: z.string(),
});

export const getTransferHistoryTypes = z.object({
  member_id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  cell_id: z.string(),
});

export const ChangeMemberStatus = z.object({
  member_id: z.string(),
  remarks: z.string(),
  new_status: z.string(),
});

export const TransferHistoryByMemberId = z.object({
  member_id: z.string(),
});
