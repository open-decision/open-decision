import { WhitelistEntry } from "@open-decision/prisma";
import prisma from "../../src/init-prisma-client";
import faker from "faker";
import { admin } from "./user.fixture";

type partialWhitelistEntry = Omit<
  WhitelistEntry,
  "createdAt" | "dateOfLastInvite"
>;

export const entryOne: partialWhitelistEntry = {
  id: faker.datatype.number(),
  emailOrDomain: faker.internet.email().toLowerCase(),
  creatorUuid: admin.uuid,
  sendInvite: false,
  type: "INDIVIDUAL",
};

export const entryTwo: partialWhitelistEntry = {
  id: faker.datatype.number(),
  emailOrDomain: faker.internet.email().toLowerCase(),
  creatorUuid: admin.uuid,
  sendInvite: true,
  type: "INDIVIDUAL",
};

export const entrySubdomainOne: partialWhitelistEntry = {
  id: faker.datatype.number(),
  emailOrDomain: "beta.open-decision.org",
  creatorUuid: admin.uuid,
  sendInvite: false,
  type: "DOMAIN",
};

export const entryBaseDomainTwo: partialWhitelistEntry = {
  id: faker.datatype.number(),
  emailOrDomain: "open-decision.org",
  creatorUuid: admin.uuid,
  sendInvite: false,
  type: "DOMAIN",
};

export const insertEntry = async (entries: partialWhitelistEntry[]) => {
  await prisma.whitelistEntry.createMany({
    data: entries,
  });
};
