import { WhitelistEntry, WhitelistingType } from "@prisma/client";
import prisma from "../init-prisma-client";
import validator from "validator";
/**
 * Get all whitelist entries
 * @param {string} email
 * @returns {boolean}
 */
export const emailIsWhitelisted = async (email: string) => {
  const domain = email.split("@").pop();
  const baseDomain = (domain: any) => {
    const temp = domain.split(".");
    return `${temp[temp.length - 2]}.${temp[temp.length - 1]}`;
  };
  let entry: WhitelistEntry | null = null;
  //exact domain
  entry = await prisma.whitelistEntry.findFirst({
    where: {
      OR: [
        {
          emailOrDomain: {
            equals: domain,
          },
          type: "DOMAIN",
        },
        {
          emailOrDomain: {
            equals: baseDomain(domain),
          },
          type: "DOMAIN",
        },
      ],
    },
  });

  if (entry) return { result: true, byDomain: true };

  entry = await prisma.whitelistEntry.findUnique({
    where: {
      emailOrDomain: email,
    },
  });

  return entry
    ? { result: true, byDomain: false }
    : { result: false, byDomain: false };
};

/**
 * Get all whitelist entries
 * @returns {Array<WhitelistEntry>}
 */
export const getAllWhitelistEntries = async () => {
  return prisma.whitelistEntry.findMany();
};

/**
 * Create many whitelist entries
 * @param {Array<string>} entries
 * @param {string} creatorUuid
 * @param {boolean} sendInvite
 */
export const createManyWhitelistEntries = async (
  entries: Array<string>,
  creatorUuid: string,
  sendInvite: boolean
) => {
  return prisma.whitelistEntry.createMany({
    data: entries.map((entry) => {
      return {
        emailOrDomain: entry,
        type: validator.isFQDN(entry)
          ? WhitelistingType.DOMAIN
          : WhitelistingType.INDIVIDUAL,
        sendInvite,
        creatorUuid,
      };
    }),
    skipDuplicates: true,
  });
};

/**
 * Delete many whitelist entries
 * @param {Array<string>} entries
 */
export const deleteManyWhitelistEntries = async (entries: Array<string>) => {
  return prisma.whitelistEntry.deleteMany({
    where: {
      emailOrDomain: {
        in: entries,
      },
    },
  });
};
