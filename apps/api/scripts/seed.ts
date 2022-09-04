import { PrismaClient } from "@open-decision/prisma";
import * as argon2 from "argon2";
import { createTreeFixture } from "@open-decision/test-utils";

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

  const user = await prisma.user.upsert({
    where: { email: "test@od.org" },
    update: {
      email: "test@od.org",
      password: await hashPassword("development"),
    },
    create: {
      email: "test@od.org",
      password: await hashPassword("development"),
    },
  });

  const activeTree = createTreeFixture({
    name: "This is an active tree",
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    updatedAt: new Date("2022-01-01T00:00:00.000Z"),
    status: "ACTIVE",
  });
  const activePublishedTree = createTreeFixture({
    name: "This is an active and published tree",
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    updatedAt: new Date("2022-01-01T00:00:00.000Z"),
    status: "ACTIVE",
  });
  const activeEmptyTree = createTreeFixture({
    name: "This is an active and empty tree",
    yDocument: "",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    updatedAt: new Date("2020-01-01T00:00:00.000Z"),
    status: "ACTIVE",
  });
  const archivedTree = createTreeFixture({
    name: "This is an archived tree",
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    updatedAt: new Date("2022-01-01T00:00:00.000Z"),
    status: "ARCHIVED",
  });
  const archivedPublishedTree = createTreeFixture({
    name: "This is an archived and published tree",
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    updatedAt: new Date("2022-01-01T00:00:00.000Z"),
    status: "ARCHIVED",
  });
  const archivedEmptyTree = createTreeFixture({
    name: "This is an archived and empty tree",
    yDocument: "",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    updatedAt: new Date("2020-01-01T00:00:00.000Z"),
    status: "ARCHIVED",
  });

  [
    activeTree,
    activePublishedTree,
    activeEmptyTree,
    archivedTree,
    archivedEmptyTree,
    archivedPublishedTree,
  ].map(
    async (tree) =>
      await prisma.decisionTree.upsert({
        create: { ...tree, ownerUuid: user.uuid },
        update: { ...tree, ownerUuid: user.uuid },
        where: { uuid: user.uuid },
      })
  );
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
