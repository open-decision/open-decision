import { PrismaClient, User, Prisma } from "@prisma/client";
import bcrypt, { compare } from "bcryptjs";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";
import { Api400Error } from "../error-handling/api-errors";
import { BaseError } from "../error-handling/base-error";

import { issueNewToken } from "./utils/generate-and-verifyToken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./utils/generate-and-verifyToken";

export async function signup(
  email: string,
  password: string,
  prisma: PrismaClient
) {
  //Has password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  let user: User;
  try {
    user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return new Api400Error({
        name: "EmailAlreadyUsed",
        message:
          "The e-mail adress is already being used. Please choose another e-mail address.",
      });
    } else {
      return new Api400Error({
        name: err.name,
        message: err.message,
      });
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  //store the refresh token in the database - this for now restricts the no. of refresh token to one
  await prisma.user.update({
    where: { uuid: user.uuid },
    data: {
      refreshToken: Base64.stringify(sha256(refreshToken)),
      //One refresh token is valid for 7 days, but within 30 days (loginExpiry) a new refresh token will be issued if the user has a valid refresh token
      refreshTokenExpiry: Math.floor(Date.now() / 1000) + 604800,
      loginExpiry: Math.floor(Date.now() / 1000) + 2592000,
    },
  });

  return {
    accessToken,
    refreshToken,
    user,
  };
}

export async function login(
  email: string,
  password: string,
  prisma: PrismaClient
) {
  // Find user in database
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return new BaseError({
      name: "InvalidCredentials",
      message:
        "The user does not exist or the password and e-mail do not match.",
    });
  }

  const passwordIsvalid = await bcrypt.compare(password, user.password);
  if (passwordIsvalid) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    //store the refresh token in the database - this for now restricts the no. of refresh token to one
    await prisma.user.update({
      where: { uuid: user.uuid },
      data: {
        refreshToken: Base64.stringify(sha256(refreshToken)),
        //One refresh token is valid for 7 days, but within 30 days (loginExpiry) a new refresh token will be issued if the user has a valid refresh token
        refreshTokenExpiry: Math.floor(Date.now() / 1000) + 604800,
        loginExpiry: Math.floor(Date.now() / 1000) + 2592000,
      },
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  } else {
    return new BaseError({
      name: "InvalidCredentials",
      message:
        "The user does not exist or the password and e-mail do not match.",
    });
  }
}

export async function refreshAndStoreNewToken(
  refreshToken: string,
  prisma: PrismaClient
) {
  const refreshReturn = await issueNewToken(refreshToken, prisma);

  if (refreshReturn instanceof Error) {
    return new BaseError({
      name: refreshReturn.name,
      message: refreshReturn.message,
    });
  }

  const { newAccessToken, newRefreshToken, user } = refreshReturn;

  // Update token but keep expiry date
  await prisma.user.update({
    where: { uuid: user.uuid },
    data: {
      refreshToken: Base64.stringify(sha256(refreshToken)),
      // We don't update the loginExpiry, the user MUST login every 30 days
      refreshTokenExpiry: Math.floor(Date.now() / 1000) + 604800,
    },
  });

  return { newAccessToken, newRefreshToken, user };
}
