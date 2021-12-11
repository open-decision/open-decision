import { Request, Response } from "express";
import dayjs from "dayjs";
import config from "../config/config";
import catchAsync from "../utils/catchAsync";
import {
  userService,
  tokenService,
  emailService,
  authService,
} from "../services/index";
import { HTTPStatusCodes } from "../types/types";
import { User } from "prisma/prisma-client";
namespace Express {
  export interface Request {
    user: User;
  }
}

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(
    res.locals.email,
    res.locals.password
  );
  const { refresh, access } = await tokenService.generateAuthTokens(user);

  res.cookie("refreshCookie", refresh, {
    maxAge: dayjs()
      .add(config.JWT_REFRESH_EXPIRATION_DAYS, "days")
      .get("seconds"),
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.status(HTTPStatusCodes.CREATED).send({ access });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = res.locals;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const { refresh, access } = await tokenService.generateAuthTokens(user);
  res.cookie("refreshCookie", refresh, {
    maxAge: dayjs()
      .add(config.JWT_REFRESH_EXPIRATION_DAYS, "days")
      .get("seconds"),
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.send({ access });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(res.locals.refreshToken);
  res.clearCookie("refreshCookie", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.status(HTTPStatusCodes.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { refresh, access } = await authService.refreshAuth(
    res.locals.refreshToken
  );

  res.cookie("refreshCookie", refresh, {
    maxAge: dayjs()
      .add(config.JWT_REFRESH_EXPIRATION_DAYS, "days")
      .get("seconds"),
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.send({ ...access });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    res.locals.email
  );
  await emailService.sendResetPasswordEmail(
    res.locals.email,
    resetPasswordToken
  );
  res.status(HTTPStatusCodes.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(res.locals.token, res.locals.password);
  res.status(HTTPStatusCodes.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(
  async (req: Express.Request, res: Response) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      req.user!
    );
    await emailService.sendVerificationEmail(req.user!.email, verifyEmailToken);
    res.status(HTTPStatusCodes.NO_CONTENT).send();
  }
);

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(res.locals.token);
  res.status(HTTPStatusCodes.NO_CONTENT).send();
});

export const authController = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
