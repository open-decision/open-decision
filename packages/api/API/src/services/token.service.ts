import jwt, { TokenExpiredError } from "jsonwebtoken";
import dayjs from "dayjs";
import config from "../config/config";
import { userService } from "./index";
import { tokenHandler } from "../models/token.model";
import ApiError from "../utils/ApiError";
import { UUID } from "../types/uuid-class";
import prisma from "../init-prisma-client";
import { TokenType, User, Token as PrismaToken } from ".prisma/client";
import httpStatus from "http-status";
import { TokenInterface } from "../types/AuthInterfaces";
import { login } from "../validations/auth.validation";
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
  secret: string
) => {
  const payload = {
    sub: userUuid instanceof UUID ? userUuid.toString() : userUuid,
    type,
    exp: expiry.unix(),
  };

  return jwt.sign(payload, secret, {
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
  blacklisted = false,
  loginExpiry: dayjs.Dayjs | null = null
) => {
  const storedToken = tokenHandler.storeInDb(
    token,
    userUuid,
    expiry,
    type,
    blacklisted,
    loginExpiry
  );
  return storedToken;
};

/**
 * Verify token (except for access token) and return token entry (or throw an error if it is not valid)
 * @param {string} token
 * @param {TokenType} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: TokenType) => {
  const secret =
    type === TokenType.REFRESH
      ? config.REFRESH_TOKEN_SECRET
      : config.ACCESS_TOKEN_SECRET;

  const verifiedToken = jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as TokenInterface;
  const tokenFromDatabase = await tokenHandler.findOne({
    token,
    ownerUuid: verifiedToken.userUuid,
    blacklisted: false,
    type,
  });

  if (!tokenFromDatabase) {
    throw new Error("Token not found");
  } else {
    return tokenFromDatabase;
  }
};

const getExpiredRefreshToken = async (token: string, secret: string) => {
  const expiredRefreshToken = jwt.verify(token, secret, {
    algorithms: ["HS256"],
    ignoreExpiration: true,
  }) as TokenInterface;

  const expiredRefreshTokenFromDatabase = await tokenHandler.findOne({
    token,
    ownerUuid: expiredRefreshToken.userUuid,
    blacklisted: false,
    type: TokenType.REFRESH,
  });
  if (!expiredRefreshTokenFromDatabase) {
    throw new Error("Token not found");
  }
  if (dayjs(expiredRefreshTokenFromDatabase?.loginExpiry).isAfter(dayjs())) {
    return expiredRefreshTokenFromDatabase;
  } else {
    throw new Error("Invalid Token, please login again.");
  }
};

const refreshTokens = async (refreshToken: string) => {
  let tokenFromDatabase: PrismaToken;
  let tokenIsExpired = false;
  try {
    tokenFromDatabase = await verifyToken(refreshToken, TokenType.REFRESH);
  } catch (error) {
    // The refresh token can be expired but we still issue a new token

    if (error instanceof TokenExpiredError && TokenType.REFRESH) {
      tokenFromDatabase = await getExpiredRefreshToken(
        refreshToken,
        config.REFRESH_TOKEN_SECRET
      );
      tokenIsExpired = true;
    } else {
      throw error;
    }
  }
  const user = await userService.getUserByUuidOrId(
    tokenFromDatabase!.ownerUuid
  );
  if (!user) {
    throw new Error();
  }
  if (!tokenIsExpired) {
    // Issue new access token
    return {
      access: generateAccessToken(tokenFromDatabase.ownerUuid),
    };
  } else {
    //Delete old refresh token
    await tokenHandler.deleteFromDbById(tokenFromDatabase!.id);
    // Issue new access and refresh token, but keep the old login expiry
    const newAuthToken = generateAccessToken(tokenFromDatabase.ownerUuid);
    const loginExpires = dayjs(tokenFromDatabase.loginExpiry);
    const newRefreshToken = await generateRefreshToken(
      tokenFromDatabase.ownerUuid,
      false,
      loginExpires
    );
    return {
      access: newAuthToken,
      refresh: newRefreshToken,
    };
  }
};
/**
 * Generate access token
 * @param {userUuid} string
 * @returns {Promise<Object>}
 */
const generateAccessToken = (userUuid: string) => {
  const accessTokenExpires = dayjs().add(
    config.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessToken = generateToken(
    userUuid,
    accessTokenExpires,
    TokenType.ACCESS,
    config.ACCESS_TOKEN_SECRET
  );
  return {
    token: accessToken,
    expires: accessTokenExpires.toDate(),
  };
};

/**
 * Generate refresh token
 * @param {userUuid} string
 * @returns {Promise<Object>}
 */
const generateRefreshToken = async (
  userUuid: string,
  isLogin = true,
  loginExpiry: dayjs.Dayjs | null = null
) => {
  const refreshTokenExpires = dayjs().add(
    config.JWT_REFRESH_EXPIRATION_DAYS,
    "days"
  );

  let loginExpiryDate;

  if (loginExpiry) {
    loginExpiryDate = loginExpiry;
  } else if (isLogin) {
    loginExpiryDate = dayjs().add(config.LOGIN_EXPIRATION_DAYS, "days");
  }

  const refreshToken = generateToken(
    userUuid,
    refreshTokenExpires,
    TokenType.REFRESH,
    config.REFRESH_TOKEN_SECRET
  );
  await saveToken(
    refreshToken,
    userUuid,
    refreshTokenExpires,
    TokenType.REFRESH,
    false,
    loginExpiryDate
  );

  return {
    token: refreshToken,
    expires: refreshTokenExpires.toDate(),
  };
};

const generateAuthTokens = async (user: User, isLogin = true) => {
  return {
    access: generateAccessToken(user.uuid),
    refresh: await generateRefreshToken(user.uuid, isLogin),
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
      statusCode: httpStatus.NOT_FOUND,
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
    TokenType.RESET_PASSWORD,
    config.ACCESS_TOKEN_SECRET
  );
  await saveToken(
    resetPasswordToken,
    user.uuid,
    expires,
    TokenType.RESET_PASSWORD,
    false
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
    TokenType.VERIFY_EMAIL,
    config.ACCESS_TOKEN_SECRET
  );
  await saveToken(verifyEmailToken, user.uuid, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};

export const tokenService = {
  generateToken,
  verifyToken,
  saveToken,
  refreshTokens,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  generateAccessToken,
  generateRefreshToken,
};
