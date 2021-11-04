import { PrismaClient, User, Prisma } from "@prisma/client";
import * as argon2 from "argon2";
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

  let user: User;
  try {
    const hashedPassword = await argon2.hash("password", {
      type: argon2.argon2id,
      timeCost: 2,
      memoryCost: 15360,
    });
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
  plainPassword: string,
  prisma: PrismaClient
) {
  // Find user in database
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return new BaseError({
      name: "InvalidCredentials",
      message: "Your e-mail and password combination is invalid.",
    });
  }

  const passwordIsvalid = await argon2.verify(user.password, plainPassword);
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
      message: "Your e-mail and password combination is invalid.",
    });
  }
}

export async function updateEmail(
  email: string,
  prisma: PrismaClient,
  user: User
) {
  //TODO: verify that e-mail is valid and lowercase, check authentication
  try {
    const updateResult = await prisma.user.update({
      where: { uuid: user.uuid },
      data: {
        email: email,
      },
    });
    return updateResult.email;
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
}

export async function changePasswordWhenLoggedIn(
  //TODO: verify password, check authentication
  newPassword: string,
  prisma: PrismaClient,
  user: User
) {
  const hashedPassword = await argon2.hash("password", {
    type: argon2.argon2id,
    timeCost: 2,
    memoryCost: 15360,
  });
}

export async function resetForgottenPassword(
  //TODO: verify password
  newPassword: string,
  prisma: PrismaClient,
  user: User,
  resetCode: string
) {}

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
