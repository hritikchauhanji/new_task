import { z } from "zod";

export const userIdSchema = z.object({
  userId: z.string().uuid("Invalid user id"),
});

export type UserIdType = z.infer<typeof userIdSchema>;
