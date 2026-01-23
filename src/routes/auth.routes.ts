import type { FastifyInstance } from "fastify";
import { login, register } from "../controllers/auth.controller.js";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/auth/register", register);
  fastify.post("/auth/login", login);
};

export default authRoutes;
