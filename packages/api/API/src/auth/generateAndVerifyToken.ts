import jwt from "jsonwebtoken";
import { User, PrismaClient } from "@prisma/client";
import { TokenInterface } from "./authInterfaces";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "SUPER_INSECURE_SECRET";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "EVEN_WORSE_SECRET";

export function generateAccessToken(user: User): string {
  return jwt.sign({ userUuid: user.uuid }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

//TODO: use opaque token to save
// export function generateRefreshToken(user: User): string {
//   return jwt.sign({ userUuid: user.uuid }, REFRESH_TOKEN_SECRET, {
//     expiresIn: "1d",
//   });
// }

export function generateRefreshToken(): string {
  return uuidv4();
}
export async function verifyAccessTokenAndGetUserId(
  token: string,
  prisma: PrismaClient
) {
  const verifiedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  const userUuid = (verifiedToken as TokenInterface).userUuid;
  //TODO: sanitize Uuid
  const user = await prisma.user.findFirst({
    where: { uuid: userUuid },
  });
  if (user) {
    return user.id;
  } else {
    //Proper error handling
    throw new Error("Wrong user");
  }
}

export async function issueNewToken(
  accessToken: string,
  refreshToken: string,
  prisma: PrismaClient
) {
  const verifiedToken = jwt.decode(accessToken);
  console.log(jwt.decode(accessToken));
  const userUuid = (verifiedToken as TokenInterface).userUuid;
  //TODO: sanitize Uuid
  const user = await prisma.user.findFirst({
    where: { uuid: userUuid },
  });
  if (user) {
    if (
      Base64.stringify(sha256(refreshToken)) === user.refreshToken &&
      Math.floor(Date.now() / 1000) < user.refreshTokenExpiry!
    ) {
      //Everything is fine
      return {
        newAccessToken: generateAccessToken(user),
        newRefreshToken: generateRefreshToken(),
        user: user,
      };
    } else {
      // If refresh token is not valid or expired
      // TODO: redirect to login
      throw new Error("Please login again");
    }
  } else {
    //Proper error handling
    throw new Error("Wrong user or access token");
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
