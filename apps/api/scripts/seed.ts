import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

async function hashPassword(plainPassword: string) {
  return argon2.hash(plainPassword, {
    type: argon2.argon2id,
    timeCost: 2,
    memoryCost: 15360,
  });
}

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findFirst({
    where: { email: "test@od.org" },
  });

  if (existingUser) return;

  await prisma.user.upsert({
    where: { email: "test@od.org" },
    update: {
      email: "test@od.org",
      role: "DEVELOPER",
      password: await hashPassword("development"),
    },
    create: {
      email: "test@od.org",
      role: "DEVELOPER",
      password: await hashPassword("development"),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
