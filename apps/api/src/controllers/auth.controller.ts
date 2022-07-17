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
} from "@open-decision/auth-api-specification";

const register = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(registerInput)(req);

  const user = await userService.createUser(
    reqData.body.email,
    reqData.body.password
  );

  const { refresh, access } = await tokenService.generateAuthTokens(user);

  if (user) {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    emailService.sendVerificationEmail(user.email, verifyEmailToken);
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
  await validateRequest(logoutInput)(req);

  await authService.logout(res.locals.refreshCookie);

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
  emailService.sendResetPasswordEmail(res.locals.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(resetPasswordInput)(req);

  await authService.resetPassword(reqData.body.token, reqData.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      req.user
    );
    emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
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
