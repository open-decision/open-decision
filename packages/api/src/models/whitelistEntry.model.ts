import prisma from "../init-prisma-client";

/**
 * Get all whitelist entries
 * @param {string} email
 * @returns {boolean}
 */
export const emailIsWhitelisted = async (email: string) => {
  const entry = await prisma.whitelistEntry.findUnique({
    where: {
      email,
    },
  });

  return entry ? true : false;
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
 * @param {Array<string>} emails
 * @param {string} creatorUuid
 * @param {boolean} sendInvite
 */
export const createManyWhitelistEntries = async (
  emails: Array<string>,
  creatorUuid: string,
  sendInvite: boolean
) => {
  return prisma.whitelistEntry.createMany({
    data: emails.map((email) => {
      return {
        email,
        sendInvite,
        creatorUuid,
      };
    }),
    skipDuplicates: true,
  });
};

/**
 * Create many whitelist entries
 * @param {Array<string>} emails
 * @param {string} creatorUuid
 * @param {boolean} sendInvite
 */
export const deleteManyWhitelistEntries = async (emails: Array<string>) => {
  return prisma.whitelistEntry.deleteMany({
    where: {
      email: {
        in: emails,
      },
    },
  });
};
