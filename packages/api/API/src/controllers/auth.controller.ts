import { Request, Response } from "express";
import config from "../config/config";
import catchAsync from "../utils/catchAsync";
import pickSafeUserProperties from "../utils/pickSafeUserProperties";
import {
  userService,
  tokenService,
  emailService,
  authService,
} from "../services/index";
import httpStatus from "http-status";
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

  res.cookie("refreshCookie", refresh.token, {
    maxAge: config.JWT_REFRESH_EXPIRATION_DAYS * 86400 * 1000,
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: "none",
  });
  res
    .status(httpStatus.CREATED)
    .send({ user: pickSafeUserProperties(user), access });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = res.locals;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const { refresh, access } = await tokenService.generateAuthTokens(user, true);
  res.cookie("refreshCookie", refresh.token, {
    maxAge: config.JWT_REFRESH_EXPIRATION_DAYS * 86400 * 1000,
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: "none",
  });
  res.send({ access });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(res.locals.refreshCookie);
  res.clearCookie("refreshCookie", {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: "none",
  });
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const refreshedTokens = await authService.refreshAuth(
    res.locals.refreshCookie
  );

  if (refreshedTokens?.refresh) {
    res.cookie("refreshCookie", (await refreshedTokens?.refresh).token, {
      maxAge: config.JWT_REFRESH_EXPIRATION_DAYS * 86400 * 1000,
      secure: config.NODE_ENV === "production" ? true : false,
      httpOnly: true,
      sameSite: "none",
    });
  }

  res.send({ access: refreshedTokens?.access });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    res.locals.email
  );
  emailService.sendResetPasswordEmail(res.locals.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(res.locals.token, res.locals.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(
  async (req: Express.Request, res: Response) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      req.user!
    );
    emailService.sendVerificationEmail(req.user!.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
  }
);

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(res.locals.token);
  res.status(httpStatus.NO_CONTENT).send();
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
