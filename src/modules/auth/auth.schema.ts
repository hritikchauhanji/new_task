import { Role } from "@prisma/client";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  email: z.string().email("Invalid email").max(50),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must be like that User@123",
    ),
  role: z.enum([Role.TEACHER, Role.STUDENT]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export type LoginSchemaType = z.infer<typeof loginSchema>;

export { loginSchema, registerSchema };
