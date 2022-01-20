import { Request, Response } from "express";
import * as R from "remeda";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import pickSafeUserProperties from "../utils/pickSafeUserProperties";
import { userService } from "../services";
import { User } from "prisma/prisma-client";
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
  const user = await userService.getUserByUuidOrId(req.params.userUuid);
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
  await userService.deleteUserByUuidOrId(req.params.userUuid);
  res.status(httpStatus.NO_CONTENT).send();
});

export const userController = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
