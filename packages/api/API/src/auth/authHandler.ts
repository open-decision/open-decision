import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

import { issueNewToken } from "./generateAndVerifyToken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./generateAndVerifyToken";

export async function signup(
  email: string,
  password: string,
  prisma: PrismaClient
) {
  //Has password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  //store the refresh token in the database - this for now restricts the no. of refresh token to one
  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: Base64.stringify(sha256(refreshToken)),
      refreshTokenExpiry: Math.floor(Date.now() / 1000) + 86400,
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
    throw new Error("No such user found");
  }

  const passwordIsvalid = await bcrypt.compare(password, user.password);
  if (passwordIsvalid) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    //store the refresh token in the database - this for now restricts the no. of refresh token to one
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: Base64.stringify(sha256(refreshToken)),
        refreshTokenExpiry: Math.floor(Date.now() / 1000) + 86400,
      },
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  } else {
    throw new Error("Invalid password");
  }
}

export async function refreshAndStoreNewToken(
  accessToken: string,
  refreshToken: string,
  prisma: PrismaClient
) {
  const { newAccessToken, newRefreshToken, user } = await issueNewToken(
    accessToken,
    refreshToken,
    prisma
  );

  // Update token but keep expiry date
  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: Base64.stringify(sha256(refreshToken)),
    },
  });

  return { newAccessToken, newRefreshToken, user };
}
