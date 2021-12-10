import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import config from "../config/config";
import { userService } from "./user.service";
// import { Token } from "../models/token.model";
import ApiError from "../utils/ApiError";
import { UUID } from "../types/uuid-class";
import prisma from "../init-prisma-client";
import { TokenType, User } from ".prisma/client";
import { HTTPStatusCodes } from "../types/types";
import { TokenInterface } from "../types/AuthInterfaces";
/**
 * Generate token
 * @param {UUID | string} userId
 * @param {dayjs.Dayjs} expires
 * @param {TokenType} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userUuid: UUID | string,
  expiry: dayjs.Dayjs,
  type: TokenType,
  secret = config.ACCESS_TOKEN_SECRET
) => {
  const payload = {
    sub: userUuid instanceof UUID ? userUuid.toString() : userUuid,
    type,
  };

  return jwt.sign(payload, secret, {
    expiresIn: expiry.millisecond(),
    algorithm: "HS256",
  });
};

/**
 * Save a token
 * @param {string} token
 * @param {UUID | string} userUuid
 * @param {dayjs.Dayjs} expires
 * @param {TokenType} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userUuid: UUID | string,
  expiry: dayjs.Dayjs,
  type: TokenType,
  blacklisted = false
) => {
  const storedToken = await prisma.token.create({
    data: {
      token,
      expires: expiry.toISOString(),
      ownerUuid: userUuid instanceof UUID ? userUuid.toString() : userUuid,
      type,
      blacklisted,
    },
  });
  return storedToken;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {TokenType} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: TokenType) => {
  const secret =
    token === TokenType.REFRESH
      ? config.REFRESH_TOKEN_SECRET
      : config.ACCESS_TOKEN_SECRET;

  const verifiedToken = jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as TokenInterface;

  const tokenFromDatabase = prisma.token.findFirst({
    where: {
      token,
      ownerUuid: verifiedToken.userUuid,
      blacklisted: false,
      type,
    },
  });

  if (!tokenFromDatabase) {
    throw new Error("Token not found");
  } else {
    return tokenFromDatabase;
  }
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user: User) => {
  const accessTokenExpires = dayjs().add(
    config.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessToken = generateToken(
    user.uuid,
    accessTokenExpires,
    TokenType.ACCESS
  );

  const refreshTokenExpires = dayjs().add(
    config.JWT_REFRESH_EXPIRATION_DAYS,
    "days"
  );
  const refreshToken = generateToken(
    user.uuid,
    refreshTokenExpires,
    TokenType.REFRESH
  );
  await saveToken(
    refreshToken,
    user.uuid,
    refreshTokenExpires,
    TokenType.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError({
      statusCode: HTTPStatusCodes.NOT_FOUND,
      message: "No users found with this email",
    });
  }
  const expires = dayjs().add(
    config.RESET_PASSWORD_EXPIRATION_MINUTES,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.uuid,
    expires,
    TokenType.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.uuid,
    expires,
    TokenType.RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: User) => {
  const expires = dayjs().add(
    config.VERIFY_EMAIL_EXPIRATION_MINUTES,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.uuid,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(
    verifyEmailToken,
    user.uuid,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  return verifyEmailToken;
};

export const tokenService = {
  generateToken,
  verifyToken,
  saveToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
