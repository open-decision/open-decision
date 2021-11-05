import jwt from "jsonwebtoken";
import { User, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

import { UUID } from "../../types/uuid-class";
import { TokenInterface } from "../types/auth-interfaces";

import { BaseError } from "../../error-handling/base-error";
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "SUPER_INSECURE_SECRET";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "EVEN_WORSE_SECRET";

export function generateAccessToken(user: User): string {
  return jwt.sign({ userUuid: user.uuid }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
    algorithm: "HS256",
  });
}

export function generateRefreshToken(): string {
  return uuidv4();
}

export function verifyAccessTokenAndGetUserUuid(token: string) {
  //TODO: whath happens if this fails?
  const verifiedToken = jwt.verify(token, ACCESS_TOKEN_SECRET, {
    algorithms: ["HS256"],
  });
  const uuid = new UUID((verifiedToken as TokenInterface).userUuid);
  if (uuid.isValid()) {
    return uuid;
  } else {
    //TODO:Switch to return, change in callers too
    throw new BaseError({
      name: "InvalidUUID",
      message: "Invalid UUID in access token.",
    });
  }
}

export function verifyAccessTokenAndGetUserUUIDAndExpiration(token: string) {
  try {
    const verifiedToken = jwt.verify(token, ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"],
    });
    const uuid = new UUID((verifiedToken as TokenInterface).userUuid);
    if (uuid.isValid()) {
      return {
        expiration: (verifiedToken as TokenInterface).exp,
        UUID: uuid,
      };
    } else {
      return Error("Invalid UUID.");
    }
  } catch {
    return Error("Token is invalid.");
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
