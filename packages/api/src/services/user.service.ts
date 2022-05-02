import { UserBody } from "../types/types";
import UserHandler from "../models/user.model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import {
  createManyWhitelistEntries,
  deleteManyWhitelistEntries,
  getAllWhitelistEntries,
  emailIsWhitelisted,
} from "../models/whitelistEntry.model";
import config from "../config/config";
/**
 * Create a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const createUser = async (email: string, password: string) => {
  if (config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS) {
    const isWhitelisted = await emailIsWhitelisted(email);
    if (!isWhitelisted) {
      throw new ApiError({
        statusCode: httpStatus.FORBIDDEN,
        message: "The email is not whitelisted.",
      });
    } else {
      // Continue with registration and delete if account creation was successfull
      const user = await UserHandler.create(email, password);
      await removeWhitelistedUsersByMail([email]);
      return user;
    }
  }
  return UserHandler.create(email, password);
};

/**
 * Get user by uuid or id
 * @param {(string|number)} uuidOrId
 * @returns {Promise<User>}
 */
const getUserByUuidOrId = async (uuidOrId: string | number) => {
  return UserHandler.findByUuidOrId(uuidOrId);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string) => {
  return UserHandler.findByEmail(email);
};

/**
 * Update user by uuid or id
 * @param {(string|number)} userIdOrUUID
 * @param {UserBody} updateBody
 * @returns {Promise<User>}
 */
const updateUserByUuidOrId = async (
  userIdOrUUID: string | number,
  updateBody: UserBody
) => {
  const user = await getUserByUuidOrId(userIdOrUUID);
  if (!user) {
    throw new ApiError({
      statusCode: httpStatus.NOT_FOUND,
      message: "User not found",
    });
  }
  if (Object.keys(updateBody).length === 0) {
    throw new ApiError({
      statusCode: httpStatus.BAD_REQUEST,
      message: "The update data is empty",
    });
  }
  if (
    updateBody.email &&
    updateBody.email !== user.email &&
    (await UserHandler.emailIsTaken(updateBody.email))
  ) {
    //OWASP: use a different error message (OWASP recommendation)?
    throw new ApiError({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Email already taken",
    });
  }
  return await UserHandler.save(updateBody, user);
};

/**
 * Delete user by uuid or id
 * @param {(string|number)} userIdOrUUID
 * @returns {Promise<User>}
 */
const deleteUserByUuidOrId = async (userIdOrUUID: string | number) => {
  try {
    return await UserHandler.remove(userIdOrUUID);
  } catch {
    //OWASP: use a different error message (OWASP recommendation)?
    throw new ApiError({
      statusCode: httpStatus.NOT_FOUND,
      message: "User not found",
    });
  }
};

/**
 * Get all whitelist entries
 * @returns {Array<WhitelistEntry>}
 */
const getWhitelist = async () => {
  return getAllWhitelistEntries();
};

/**
 * Whitelist users email
 * @param {Array<string>} emails
 * @param {string} creatorUuid
 * @param {boolean} sendInvite
 */
const whitelistUsersByMail = async (
  emails: Array<string>,
  creatorUuid: string,
  sendInvite: boolean
) => {
  try {
    await createManyWhitelistEntries(emails, creatorUuid, sendInvite);
  } catch {
    throw new ApiError({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Creation of whitelist entries failed.",
    });
  }
};

/**
 * Remove entries from whitelist
 * @param {Array<string>} emails
 */
const removeWhitelistedUsersByMail = async (emails: Array<string>) => {
  try {
    await deleteManyWhitelistEntries(emails);
  } catch {
    throw new ApiError({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Deletion of whitelist entries failed.",
    });
  }
};

export const userService = {
  createUser,
  getUserByUuidOrId,
  getUserByEmail,
  updateUserByUuidOrId,
  deleteUserByUuidOrId,
  getWhitelist,
  whitelistUsersByMail,
  removeWhitelistedUsersByMail,
};
