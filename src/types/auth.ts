import type { Role } from "@prisma/client";

export type AuthPayload = {
  id: string;
  role: Role;
};
