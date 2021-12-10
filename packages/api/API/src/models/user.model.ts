import ApiError from "../utils/ApiError";
import { User as PrismaUser, Prisma } from "@prisma/client";
import { HTTPStatusCodes, UserBody } from "../types/types";
import prisma from "../init-prisma-client";
import * as argon2 from "argon2";
import { UUID } from "../types/uuid-class";
import { returnStatement } from "@babel/types";

async function create(email: string, password: string) {
  let user: PrismaUser;
  if (!isEmailTaken) {
    return prisma.user.create({
      data: { email, password: await hashPassword(password) },
    });
  }
  //OWASP: use a different error message (OWASP recommendation)?
  throw new ApiError({
    name: "EmailAlreadyUsed",
    statusCode: HTTPStatusCodes.BAD_REQUEST,
    message:
      "The e-mail adress is already being used. Please choose another e-mail address.",
    // "A link to activate your account has been emailed to the address provided.",
  });
}

/**
 * Check if email is already taken
 * @param {string} email
 * @returns {boolean}
 */
async function isEmailTaken(email: string) {
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

async function hashPassword(plainPassword: string) {
  return await argon2.hash(plainPassword, {
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
  return await argon2.verify(user.password, password);
}

async function findByUuidOrId(uuidOrId: UUID | number) {
  if (uuidOrId instanceof UUID) {
    return prisma.user.findUnique({
      where: {
        uuid: uuidOrId.toString(),
      },
    });
  } else {
    return prisma.user.findUnique({
      where: {
        id: uuidOrId,
      },
    });
  }
}

async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

//WARNING: careful, check what the user is allowed to modify in the right controller
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

async function remove(userIdOrUUID: UUID | number) {
  const uniqueConstraint =
    userIdOrUUID instanceof UUID
      ? { uuid: userIdOrUUID.toString() }
      : { id: userIdOrUUID };
  return prisma.user.delete({
    where: uniqueConstraint,
  });
}

const UserHandler = {
  create,
  isEmailTaken,
  isPasswordMatch,
  findByUuidOrId,
  findByEmail,
  save,
  remove,
};

export default UserHandler;
