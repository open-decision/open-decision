import ApiError from "../utils/ApiError";
import { User as PrismaUser, Prisma } from "@prisma/client";
import { UserBody } from "../types/types";
import prisma from "../init-prisma-client";
import * as argon2 from "argon2";
import getConstraint from "../utils/getConstraint";
import httpStatus from "http-status";
import config from "../config/config";

/**
 * Create a new user
 * @param {string} email
 * @param {password} string
 * @returns {Promise<User>}
 */
async function create(email: string, password: string) {
  if (await emailIsTaken(email)) {
    //OWASP: use a different error message (OWASP recommendation)?
    throw new ApiError({
      name: "EmailAlreadyUsed",
      statusCode: httpStatus.BAD_REQUEST,
      message:
        "The e-mail adress is already being used. Please choose another e-mail address.",
      // "A link to activate your account has been emailed to the address provided.",
    });
  } else {
    if (config.DEV_ACCOUNT_WHITELIST.includes(email)) {
      return prisma.user.create({
        data: {
          email,
          password: await hashPassword(password),
          role: "DEVELOPER",
        },
      });
    }
    return prisma.user.create({
      data: { email, password: await hashPassword(password) },
    });
  }
}

/**
 * Check if email is already taken
 * @param {string} email
 * @returns {boolean}
 */
async function emailIsTaken(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return false;
  }
  return true;
}

/**
 * Hash a plain text password using argon2id hashing algorithm
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
async function hashPassword(plainPassword: string) {
  return argon2.hash(plainPassword, {
    type: argon2.argon2id,
    timeCost: 2,
    memoryCost: 15360,
  });
}

/**
 * Check if password matches the user's password
 * @param {string} password
 * @param {User} user
 * @returns {Promise<boolean>}
 */
async function isPasswordMatch(password: string, user: PrismaUser) {
  return argon2.verify(user.password, password);
}

/**
 * Find user by UUID or id
 * @param {(string|number)} uuidOrId
 * @returns {Promise<User>}
 */
async function findByUuidOrId(uuidOrId: string | number) {
  return prisma.user.findUnique({
    where: getConstraint(uuidOrId),
  });
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

/**
 * Save changes coming from an user body object to an user
 * @param {UserBody} userBody
 * @param {User} user
 * @returns {Promise<User>}
 */
async function save(userBody: UserBody, user: PrismaUser) {
  if (userBody.password) {
    userBody.password = await hashPassword(userBody.password);
  }

  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...userBody,
    },
  });
}

/**
 * Remove an user using its UUID or id
 * @param {(string|number)} userIdOrUUID
 * @returns {Promise<User>}
 */
async function remove(userIdOrUUID: string | number) {
  return prisma.user.delete({
    where: getConstraint(userIdOrUUID),
  });
}

const UserHandler = {
  create,
  emailIsTaken,
  isPasswordMatch,
  findByUuidOrId,
  findByEmail,
  save,
  remove,
};

export default UserHandler;
