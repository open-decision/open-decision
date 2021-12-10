import { Request, Response } from "express";
import { HTTPStatusCodes } from "../types/types";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { userService } from "../services";
import { UUID } from "../types/uuid-class";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(
    res.locals.email,
    res.locals.password
  );
  res.status(HTTPStatusCodes.CREATED).send(user);
});

// const getUsers = catchAsync(async (req: Request, res: Response) => {
//   const filter = pick(req.query, ["name", "role"]);
//   const options = pick(req.query, ["sortBy", "limit", "page"]);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });

const getUser = catchAsync(async (req: Request, res: Response) => {
  const uuid = new UUID(res.locals.useruuid);
  const user = await userService.getUserByUuidOrId(req.params.user);
  if (!user) {
    throw new ApiError({
      statusCode: HTTPStatusCodes.NOT_FOUND,
      message: "User not found",
    });
  }
  res.send(user);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserByUuidOrId(
    req.params.userId,
    req.body
  );
  res.send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUserByUuidOrId(req.params.userId);
  res.status(HTTPStatusCodes.NO_CONTENT).send();
});

export const userController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
