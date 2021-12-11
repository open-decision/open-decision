import { HTTPStatusCodes, UserBody } from "../types/types";
import UserHandler from "../models/user.model";
import ApiError from "../utils/ApiError";
import { UUID } from "../types/uuid-class";
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (email: string, password: string) => {
  return UserHandler.create(email, password);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const queryUsers = async (filter, options) => {
//   const users = await User.paginate(filter, options);
//   return users;
// };

/**
 * Get user by uuid or id
 * @param {UUID|number} uuidOrId
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
 * @param {UUID | number} userIdOrUUID
 * @param {UserBody} updateBody
 * @returns {Promise<User>}
 */
const updateUserByUuidOrId = async (
  userIdOrUUID: string | number,
  updateBody: UserBody
) => {
  const user = await getUserByUuidOrId(userIdOrUUID);
  if (!user) {
    //OWASP: use a different error message (OWASP recommendation)?
    throw new ApiError({
      statusCode: HTTPStatusCodes.NOT_FOUND,
      message: "User not found",
    });
  }
  if (updateBody.email && (await UserHandler.isEmailTaken(updateBody.email))) {
    //OWASP: use a different error message (OWASP recommendation)?
    throw new ApiError({
      statusCode: HTTPStatusCodes.BAD_REQUEST,
      message: "Email already taken",
    });
  }
  return await UserHandler.save(updateBody, user);
};

/**
 * Delete user by uuid or id
 * @param {UUID | number} userIdOrUUID
 * @returns {Promise<User>}
 */
const deleteUserByUuidOrId = async (userIdOrUUID: string | number) => {
  try {
    return await UserHandler.remove(userIdOrUUID);
  } catch {
    //OWASP: use a different error message (OWASP recommendation)?
    throw new ApiError({
      statusCode: HTTPStatusCodes.NOT_FOUND,
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
