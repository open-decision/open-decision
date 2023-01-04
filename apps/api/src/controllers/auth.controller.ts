import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import pickSafeUserProperties from "../utils/pickSafeUserProperties";
import {
  userService,
  tokenService,
  emailService,
  authService,
} from "../services/index";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import {
  registerInput,
  loginInput,
  logoutInput,
  refreshTokenInput,
  forgotPasswordInput,
  resetPasswordInput,
  verifyEmailInput,
  TRefreshTokenOutput,
  TLoginOutput,
  TRegisterOutput,
  TResetPasswordOutput,
} from "@open-decision/api-specification";
import UserHandler from "../models/user.model";
import { APIError } from "@open-decision/type-classes";

const register = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(registerInput)(req);

  const user = await userService.createUser(
    reqData.body.email,
    reqData.body.password
  );

  const { refresh, access } = await tokenService.generateAuthTokens(user);

  if (user) {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      user.uuid
    );

    await emailService?.sendVerificationEmail(user.email, verifyEmailToken);
  }

  res.status(httpStatus.CREATED).send({
    user: pickSafeUserProperties(user),
    access: {
      token: access,
      refreshToken: refresh,
    },
  } as TRegisterOutput);
});

const login = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(loginInput)(req);

  const { email, password } = reqData.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  const { refresh, access } = await tokenService.generateAuthTokens(user);
  res.send({
    user: pickSafeUserProperties(user),
    access: {
      token: access,
      refreshToken: refresh,
    },
  } as TLoginOutput);
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(logoutInput)(req);

  await authService.logout(reqData.body.refreshToken);

  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(refreshTokenInput)(req);

  const refreshedTokens = await authService.refreshAuth(
    reqData.body.refreshToken
  );

  res.send({
    user: pickSafeUserProperties(refreshedTokens.user),
    access: {
      token: refreshedTokens?.access,
      refreshToken: refreshedTokens?.refresh,
    },
  } as TRefreshTokenOutput);
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(forgotPasswordInput)(req);

  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    reqData.body.email
  );

  await emailService?.sendResetPasswordEmail(
    reqData.body.email,
    resetPasswordToken
  );

  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(resetPasswordInput)(req);

  const user = await authService.resetPassword(
    reqData.body.token,
    reqData.body.password
  );
  const { refresh, access } = await tokenService.generateAuthTokens(user);
  res.send({
    user: pickSafeUserProperties(user),
    access: {
      token: access,
      refreshToken: refresh,
    },
  } as TResetPasswordOutput);
});

const sendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const user = await UserHandler.findByUuidOrId(req.user.uuid);
    if (!user) throw new APIError({ code: "UNAUTHENTICATED" });
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      req.user.uuid
    );
    await emailService?.sendVerificationEmail(user.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
  }
);

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(verifyEmailInput)(req);

  await authService.verifyEmail(reqData.body.token);
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
