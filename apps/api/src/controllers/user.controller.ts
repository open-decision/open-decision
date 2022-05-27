import { Request, Response } from "express";
import * as R from "remeda";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import pickSafeUserProperties from "../utils/pickSafeUserProperties";
import { userService } from "../services";
import { User } from "@open-decision/models/prisma-client";
import { userValidation } from "../validations";
import validateRequest from "../validations/validateRequest";
namespace Express {
  export interface Request {
    user?: User;
  }
}
const createUser = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(userValidation.createUser)(req);

  const user = await userService.createUser(
    reqData.body.email,
    reqData.body.password
  );
  res.status(httpStatus.CREATED).send(user);
});

// const getUsers = catchAsync(async (req: Request, res: Response) => {
//   const filter = pick(req.query, ["name", "role"]);
//   const options = pick(req.query, ["sortBy", "limit", "page"]);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });

const getUser = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(userValidation.getUser)(req);

  const user = await userService.getUserByUuidOrId(reqData.params.userUuid);
  if (!user) {
    throw new ApiError({
      statusCode: httpStatus.NOT_FOUND,
      message: "User not found",
    });
  }
  res.send(pickSafeUserProperties(user));
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(userValidation.updateUser)(req);

  //These are the only values an user is allowed to change, check how to allow editing by admins
  const updateData = R.pick(reqData.body, ["name", "email", "password"]);
  const user = await userService.updateUserByUuidOrId(
    reqData.params.userUuid,
    updateData
  );
  res.send(pickSafeUserProperties(user));
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(userValidation.deleteUser)(req);
  await userService.deleteUserByUuidOrId(reqData.params.userUuid);
  res.status(httpStatus.NO_CONTENT).send();
});

const getWhitelist = catchAsync(async (req: Request, res: Response) => {
  const entries = await userService.getWhitelist();
  res.send(entries);
});

const isWhitelisted = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(userValidation.isWhitelisted)(req);
  const result = await userService.isWhitelisted(reqData.body.email);
  res.send({ isWhitelisted: result });
});

const addToWhitelist = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(
    userValidation.whitelistUsersForRegistration
  )(req);

  // @ts-ignore
  const creatorUuid = req.user.uuid;
  await userService.whitelistUsersByMail(
    reqData.body.emails,
    creatorUuid,
    reqData.body.sendInvite ?? false
  );
  res.status(httpStatus.NO_CONTENT).send();
});

const removeFromWhitelist = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(
    userValidation.removeUsersFromWhitelist
  )(req);
  await userService.removeWhitelistedUsersByMail(reqData.body.emails);
  res.status(httpStatus.NO_CONTENT).send();
});

export const userController = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getWhitelist,
  addToWhitelist,
  removeFromWhitelist,
  isWhitelisted,
};
