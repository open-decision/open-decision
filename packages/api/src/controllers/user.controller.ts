import { Request, Response } from "express";
import * as R from "remeda";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import pickSafeUserProperties from "../utils/pickSafeUserProperties";
import { userService } from "../services";
import { User } from "@prisma-client";
namespace Express {
  export interface Request {
    user?: User;
  }
}
const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(
    res.locals.email,
    res.locals.password
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
  const user = await userService.getUserByUuidOrId(res.locals.userUuid);
  if (!user) {
    throw new ApiError({
      statusCode: httpStatus.NOT_FOUND,
      message: "User not found",
    });
  }
  res.send(pickSafeUserProperties(user));
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  //These are the only values an user is allowed to change, check how to allow editing by admins
  const updateData = R.pick(req.body, ["name", "email", "password"]);
  const user = await userService.updateUserByUuidOrId(
    res.locals.userUuid,
    updateData
  );
  res.send(pickSafeUserProperties(user));
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  await userService.deleteUserByUuidOrId(res.locals.userUuid);
  res.status(httpStatus.NO_CONTENT).send();
});

const getWhitelist = catchAsync(async (req: Request, res: Response) => {
  const entries = await userService.getWhitelist();
  res.send(entries);
});

const addToWhitelist = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  const creatorUuid = req.user.uuid;
  await userService.whitelistUsersByMail(
    res.locals.emails as Array<string>,
    creatorUuid,
    res.locals.sendInvite ?? false
  );
  res.status(httpStatus.NO_CONTENT).send();
});

const removeFromWhitelist = catchAsync(async (req: Request, res: Response) => {
  await userService.removeWhitelistedUsersByMail(
    res.locals.emails as Array<string>
  );
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
};
