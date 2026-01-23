import fp from "fastify-plugin";
import pkg from "@prisma/client";
import type { FastifyInstance } from "fastify";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
