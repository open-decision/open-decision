import { HTTPStatusCodes } from "../types/types";
import { tokenService, userService } from ".";
import ApiError from "../utils/ApiError";
import { TokenType } from ".prisma/client";
import UserHandler from "../models/user.model";
import prisma from "../init-prisma-client";
import { UUID } from "../types/uuid-class";
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await UserHandler.isPasswordMatch(password, user))) {
    throw new ApiError({
      statusCode: HTTPStatusCodes.UNAUTHORIZED,
      message: "Incorrect email or password",
    });
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken: string) => {
  const refreshTokenFromDb = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
      blacklisted: false,
    },
  });
  if (!refreshTokenFromDb) {
    throw new ApiError({
      statusCode: HTTPStatusCodes.NOT_FOUND,
      message: "Not found",
    });
  }
  await prisma.token.delete({
    where: {
      id: refreshTokenFromDb.id,
    },
  });

  //TODO: reimplement accessTokenBlocklist
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenFromDb = await tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH
    );
    const userUuid = new UUID(refreshTokenFromDb!.ownerUuid);
    const user = await userService.getUserByUuidOrId(userUuid);
    if (!user) {
      throw new Error();
    }
    await prisma.token.delete({
      where: {
        id: refreshTokenFromDb?.id,
      },
    });
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError({
      statusCode: HTTPStatusCodes.UNAUTHORIZED,
      message: "Please authenticate",
    });
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
) => {
  try {
    const resetPasswordTokenFromDb = await tokenService.verifyToken(
      resetPasswordToken,
      TokenType.RESET_PASSWORD
    );
    const userUuid = new UUID(resetPasswordTokenFromDb!.ownerUuid);
    const user = await userService.getUserByUuidOrId(userUuid);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserByUuidOrId(user.id, { password: newPassword });
    await prisma.token.deleteMany({
      where: {
        ownerUuid: userUuid.toString(),
        type: TokenType.REFRESH,
      },
    });
    //TODO: add acccessToken to blocklist
  } catch (error) {
    throw new ApiError({
      statusCode: HTTPStatusCodes.UNAUTHORIZED,
      message: "Password reset failed",
    });
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyEmailTokenFromDb = await tokenService.verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL
    );
    const userUuid = new UUID(verifyEmailTokenFromDb!.ownerUuid);

    const user = await userService.getUserByUuidOrId(userUuid);
    if (!user) {
      throw new Error();
    }
    await prisma.token.deleteMany({
      where: {
        ownerUuid: userUuid.toString(),
        type: TokenType.VERIFY_EMAIL,
      },
    });
    await userService.updateUserByUuidOrId(user.id, { emailIsVerified: true });
  } catch (error) {
    throw new ApiError({
      statusCode: HTTPStatusCodes.UNAUTHORIZED,
      message: "Email verification failed",
    });
  }
};

export const authService = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
