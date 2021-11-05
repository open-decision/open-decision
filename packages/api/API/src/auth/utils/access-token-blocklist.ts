//Takes care of blocking access tokens as they cannot be revoked
import { PrismaClient, Prisma } from ".prisma/client";
import { BaseError } from "../../error-handling/base-error";
import { verifyAccessTokenAndGetUserUUIDAndExpiration } from "./generate-and-verifyToken";
import * as schedule from "node-schedule";

export async function cleanBlocklist(prisma: PrismaClient) {
  //Runs every half hour and cleans all expired token from the blocklist
  const job = schedule.scheduleJob("30 * * * *", async function () {
    const currentTime = Math.floor(Date.now() / 1000);
    prisma.blockedAccessToken.deleteMany({
      where: {
        expiry: {
          lte: currentTime,
        },
      },
    });
  });
}

export async function blockAccessToken(
  accessToken: string,
  prisma: PrismaClient
) {
  const tokenData = verifyAccessTokenAndGetUserUUIDAndExpiration(accessToken);

  if (!(tokenData instanceof Error)) {
    try {
      const blockedToken = await prisma.blockedAccessToken.create({
        data: {
          uuid: tokenData.UUID.toString(),
          token: accessToken,
          expiry: tokenData.expiration,
        },
      });
      return blockedToken;
    } catch (err: any) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        //this is Prisma's error code if the unique constraint failed (meaning the token is already in the blocklist)
        return new BaseError({
          name: "TokenAlreadyBlocked",
          message: "The token is already in the blocklist.",
        });
      }
    }
  } else {
    return new BaseError({
      name: "InvalidToken",
      message: "The token is invalid and doesn't need to be blocked.",
    });
  }
}

export async function isAccessTokenBlocked(
  accessToken: string,
  prisma: PrismaClient
) {
  const isBlocked = await prisma.blockedAccessToken.findUnique({
    where: {
      token: accessToken,
    },
  });
  if (isBlocked) {
    return true;
  } else {
    return false;
  }
}
