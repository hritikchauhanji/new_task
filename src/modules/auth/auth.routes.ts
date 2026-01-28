import type { FastifyInstance } from "fastify";
import { login, register } from "./auth.controller.js";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/register", register);
  fastify.post("/login", login);
};

export default authRoutes;
