import prisma from "../init-prisma-client";
import dayjs from "dayjs";
import { UUID } from "../types/uuid-class";
import { TokenType, User } from ".prisma/client";
import { FindTokenInterface } from "../types/types";
/**
 * Store a token in DB
 * @param {string} token
 * @param {(UUID|string)} userUuid
 * @param {dayjs.Dayjs} expiry
 * @param {TokenType} type
 * @param {boolean} blacklisted
 * @returns {Promise<Token>}}
 */

async function storeInDb(
  token: string,
  userUuid: UUID | string,
  expiry: dayjs.Dayjs,
  type: TokenType,
  blacklisted = false
) {
  return prisma.token.create({
    data: {
      token,
      expires: expiry.toISOString(),
      ownerUuid: userUuid instanceof UUID ? userUuid.toString() : userUuid,
      type,
      blacklisted,
    },
  });
}

/**
 * Find a token stored in the DB
 * @param {FindTokenInterface} constraints
 * @returns {Promise<Token>}}
 */

async function findOne(constraints: FindTokenInterface) {
  return prisma.token.findFirst({
    where: constraints,
  });
}

/**
 * Delete a token stored in the DB
 * @param {number} id
 * @returns {Promise<Token>}}
 */
async function deleteFromDbById(id: number) {
  return prisma.token.delete({
    where: {
      id,
    },
  });
}

/**
 * Delete all token of one user of a specific type
 * @param {string} userUuid
 * @param {TokenType} type
 * @returns {Promise<Prisma.BatchPayload>}
 */
async function deleteAllTokenOfUser(userUuid: string, type: TokenType) {
  return prisma.token.deleteMany({
    where: {
      ownerUuid: userUuid.toString(),
      type,
    },
  });
}

export const tokenHandler = {
  storeInDb,
  findOne,
  deleteFromDbById,
  deleteAllTokenOfUser,
};
