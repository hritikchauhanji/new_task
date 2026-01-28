import { z } from "zod";

export const studentIdSchema = z.object({
  studentId: z.string().uuid("Invalid student Id"),
});

export type StudentIdType = z.infer<typeof studentIdSchema>;
