import { UserBody } from "../types/types";
import UserHandler from "../models/user.model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
/**
 * Create a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const createUser = async (email: string, password: string) => {
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

export const userService = {
  createUser,
  getUserByUuidOrId,
  getUserByEmail,
  updateUserByUuidOrId,
  deleteUserByUuidOrId,
};
