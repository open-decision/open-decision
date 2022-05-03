import { WhitelistEntry } from "@prisma-client";
import prisma from "../../src/init-prisma-client";
import faker from "faker";
import { admin } from "./user.fixture";

type partialWhitelistEntry = Omit<
  WhitelistEntry,
  "createdAt" | "dateOfLastInvite"
>;

export const entryOne: partialWhitelistEntry = {
  id: faker.datatype.number(),
  email: faker.internet.email().toLowerCase(),
  creatorUuid: admin.uuid,
  sendInvite: false,
};

export const entryTwo: partialWhitelistEntry = {
  id: faker.datatype.number(),
  email: faker.internet.email().toLowerCase(),
  creatorUuid: admin.uuid,
  sendInvite: true,
};

export const insertEntry = async (entries: partialWhitelistEntry[]) => {
  await prisma.whitelistEntry.createMany({
    data: entries,
  });
};
