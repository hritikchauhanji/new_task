import { PrismaClient, Role } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
  interface FastifyRequest {
    user: {
      id: string;
      role: Role;
    };
  }
}
