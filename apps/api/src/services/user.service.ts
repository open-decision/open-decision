import { UserBody } from "../types/types";
import UserHandler from "../models/user.model";
import {
  createManyWhitelistEntries,
  deleteManyWhitelistEntries,
  getAllWhitelistEntries,
  emailIsWhitelisted,
} from "../models/whitelistEntry.model";
import config from "../config/config";
import { APIError } from "@open-decision/type-classes";
/**
 * Create a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const createUser = async (email: string, password: string) => {
  if (config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS) {
    const isWhitelisted = await emailIsWhitelisted(email);
    if (!isWhitelisted.result) {
      throw new APIError({
        code: "EMAIL_NOT_WHITELISTED",
        message: "The email is not whitelisted.",
      });
    } else {
      // Continue with registration and delete if account creation was successfull
      const user = await UserHandler.create(email, password);
      if (!isWhitelisted.byDomain) await removeWhitelistedUsersByMail([email]);
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
    throw new APIError({
      code: "USER_NOT_FOUND",
      message: "User not found",
    });
  }
  if (Object.keys(updateBody).length === 0) {
    throw new APIError({
      code: "INVALID_DATA",
      message: "The update data is empty",
    });
  }
  if (
    updateBody.email &&
    updateBody.email !== user.email &&
    (await UserHandler.emailIsTaken(updateBody.email))
  ) {
    //OWASP: use a different error message (OWASP recommendation)?
    throw new APIError({
      code: "EMAIL_ALREADY_USED",
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
    throw new APIError({
      code: "USER_NOT_FOUND",
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
 * Check if one email is whitelisted
 * @param {string} email
 * @returns {Array<WhitelistEntry>}
 */
const isWhitelisted = async (email: string) => {
  return await (
    await emailIsWhitelisted(email)
  ).result;
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
    throw new APIError({
      code: "WHITELIST_ENTRY_COULD_NOT_BE_CREATED",
      message: "Creation of whitelist entries failed.",
    });
  }
};

/**
 * Remove entries from whitelist
 * @param {Array<string>} emailsOrDomains
 */
const removeWhitelistedUsersByMail = async (emailsOrDomains: Array<string>) => {
  try {
    await deleteManyWhitelistEntries(emailsOrDomains);
  } catch {
    throw new APIError({
      code: "WHITELIST_ENTRY_COULD_NOT_BE_DELETED",
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
  isWhitelisted,
};
