import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  const password = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Principal",
      email: "admin@gmail.com",
      password,
      role: Role.PRINCIPAL,
      isVerified: true,
    },
  });

  console.log("Principal seeded");
}

seed().catch((err) => {
  console.log("Error", err);
});
