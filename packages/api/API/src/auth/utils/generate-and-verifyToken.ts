import jwt from "jsonwebtoken";
import { User, PrismaClient } from "@prisma/client";
import { TokenInterface } from "../types/auth-interfaces";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";
import isUUID from "validator/lib/isUUID";

import { BaseError } from "../../error-handling/base-error";
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "SUPER_INSECURE_SECRET";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "EVEN_WORSE_SECRET";

export function generateAccessToken(user: User): string {
  return jwt.sign({ userUuid: user.uuid }, ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export function generateRefreshToken(): string {
  return uuidv4();
}

export function verifyAccessTokenAndGetUserUuid(token: string) {
  const verifiedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  const uuid = (verifiedToken as TokenInterface).userUuid;
  if (isUUID(uuid)) {
    return uuid;
  } else {
    // Switch to return
    throw new BaseError({
      name: "InvalidUUID",
      message: "Invalid UUID in access token.",
    });
  }
}

export async function issueNewToken(
  refreshToken: string,
  prisma: PrismaClient
) {
  const hashedToken = Base64.stringify(sha256(refreshToken));
  const user = await prisma.user.findFirst({
    where: { refreshToken: hashedToken },
  });
  if (user) {
    const now = Math.floor(Date.now() / 1000);

    if (now < user.loginExpiry!) {
      if (now < user.refreshTokenExpiry!) {
        // If the refresh token was issued less than 7 days ago and the last login was last than 30 days ago.
        return {
          newAccessToken: generateAccessToken(user),
          newRefreshToken: generateRefreshToken(),
          user: user,
        };
      } else {
        // Login is still valid but refresh token expired.
        return new BaseError({
          name: "RefreshTokenExpired",
          message: "Refresh Token expired, please login again",
        });
      }
    } else {
      // Login has expired.
      return new BaseError({
        name: "LoginExpired",
        message: "Login expired, please login again",
      });
    }
  } else {
    // The refresh token is completely invalid and wasn't found in the database.
    return new BaseError({
      name: "InvalidRefreshToken",
      message: "The Refresh Token is invalid, please login again,",
    });
  }
}

// export async function validateRefreshTokenAndGetUserId(
//   token: string,
//   prisma: PrismaClient
// ) {
//   const verifiedToken = jwt.verify(token, REFRESH_TOKEN_SECRET);
//   const userUuid = (verifiedToken as TokenInterface).userUuid;
//   //TODO: sanitize Uuid
//   const user = await prisma.user.findFirst({
//     where: { uuid: userUuid },
//   });
//   if (user) {
//     return user.id;
//   } else {
//     //Proper error handling
//     return "Wrong user";
//   }
// }

//verify token and get uuid
//Map uuid to userId
