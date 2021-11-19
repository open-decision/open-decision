import express, { Request, Response, NextFunction } from "express";
import { body, cookie, validationResult } from "express-validator";
import {
  signup,
  login,
  logout,
  refreshAndStoreNewToken,
  requestPasswordResetMail,
  resetPasswordWithCode,
  changePasswordWhenLoggedIn,
  updateEmail,
} from "./auth-functions";
import { Api400Error } from "../error-handling/api-errors";
import isJWT from "validator/lib/isJWT";
import isUUID from "validator/lib/isUUID";
import { LogoutInterface } from "./types/auth-interfaces";
import { isAuthorized } from "./authentication-middleware";
export const authRouter = express.Router();

//Base routes
authRouter.post(
  "/signup",
  body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(),
  body(
    "password",
    "The password must be at least 8 characters and at most 100 characters long."
  ).isLength({ min: 8, max: 100 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new Api400Error({
          name: "InvalidInput",
          message: "Missing or incorrect input data.",
          additionalErrorData: errors.array(),
        })
      );
    }
    let signupResult;
    signupResult = await signup(req.body.email, req.body.password);

    if (signupResult instanceof Error) {
      return next(
        new Api400Error({
          name: signupResult.name,
          message: signupResult.message,
        })
      );
    }

    const { accessToken, refreshToken, user } = signupResult;

    //Handle refresh token - set httpOnly cookie
    res.cookie("refreshCookie", refreshToken, {
      maxAge: 604800,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });

    //Set the return body
    res.json({
      accessToken: accessToken,
      user: user.email,
      status: "ok",
    });
  }
);

authRouter.post(
  "/login",
  body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new Api400Error({
          name: "InvalidInput",
          message: "Missing or incorrect input data.",
          additionalErrorData: errors.array(),
        })
      );
    }

    const loginResult = await login(req.body.email, req.body.password);
    if (loginResult instanceof Error) {
      return next(
        new Api400Error({
          name: loginResult.name,
          message: loginResult.message,
        })
      );
    }

    const { accessToken, refreshToken, user } = loginResult;

    //Handle refresh token - set httpOnly cookie
    res.cookie("refreshCookie", refreshToken, {
      maxAge: 604800,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });

    //Set the return body
    res.json({ accessToken: accessToken, status: "ok" });
  }
);

authRouter.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    const refreshToken = req.cookies.refreshCookie;

    const logoutData: LogoutInterface = {};

    if (accessToken && isJWT(accessToken)) {
      logoutData.accessToken = accessToken;
    }

    if (refreshToken && isUUID(refreshToken)) {
      logoutData.refreshToken = refreshToken;
    }
    //There is no real failing here. If the accessToken is still valid, it's blacklisted. If it's invalid, we don't do anything.
    //If the refreshToken is valid, it's being deleted from the database. If not, we don't do anything.

    await logout(logoutData);

    //TODO: send delete cookie command to client
    res.json({ status: "ok" });
  }
);

authRouter.post(
  "/refresh",
  cookie(
    "refreshCookie",
    "Didn't find a valid refreshToken in the refreshCookie."
  ).isUUID(4),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new Api400Error({
          name: "InvalidRefreshToken",
          message: "Missing or incorrectly formatted refresh token.",
          additionalErrorData: errors.array(),
        })
      );
    } else {
      const refreshToken = req.cookies.refreshCookie;

      const refreshHandlerReturn = await refreshAndStoreNewToken(refreshToken);

      if (refreshHandlerReturn instanceof Error) {
        next(
          new Api400Error({
            name: refreshHandlerReturn.name,
            message: refreshHandlerReturn.message,
          })
        );
      } else {
        const { newAccessToken, newRefreshToken, user } = refreshHandlerReturn;
        //Handle refresh token - set httpOnly cookie
        res.cookie("refreshCookie", newRefreshToken, {
          maxAge: 604800,
          secure: true,
          httpOnly: true,
          sameSite: "none",
        });

        //Set the return body
        res.json({
          accessToken: newAccessToken,
          status: "ok",
        });
      }
    }
  }
);

//Methods which require the user to be signed in
authRouter.get(
  "/profile",
  isAuthorized,
  async (req: Request, res: Response, next: NextFunction) => {}
);

authRouter.post(
  "/settings/password",
  isAuthorized,
  body("oldPassword", "The old password seems to be invalid.").isLength({
    min: 8,
    max: 100,
  }),
  body(
    "newPassword",
    "The new password must be at least 8 characters and at most 100 characters long."
  ).isLength({ min: 8, max: 100 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new Api400Error({
          name: "InvalidPassword",
          message: "The old or new password is in an invalid format.",
          additionalErrorData: errors.array(),
        })
      );
    } else {
      //Even though the user is already signed-in, we want to request the password again
      //to prevent abuse by a third party using a logged-in account
      const result = changePasswordWhenLoggedIn(
        req.body.oldPassword,
        req.body.newPassword,
        res.context.userUuid!
      );
    }
  }
);

authRouter.post(
  "/settings/email",
  isAuthorized,
  body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new Api400Error({
          name: "InvalidEmail",
          message: "Missing or incorrect email data.",
          additionalErrorData: errors.array(),
        })
      );
    } else {
      const result = await updateEmail(req.body.email, res.context.userUuid!);
      if (result instanceof Api400Error) {
        return next(result);
      } else {
        res.json({
          message: `E-Mail was changed to ${result}`,
          status: "ok",
        });
      }
    }
  }
);

//Reset password routes
authRouter.post(
  "/request-password-reset/",
  body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new Api400Error({
          name: "InvalidEmail",
          message: "Missing or incorrect e-mail address.",
          additionalErrorData: errors.array(),
        })
      );
    } else {
      requestPasswordResetMail(req.body.email);
      res.json({
        message:
          "If this account exists in our database, we will send you an e-mail to reset your password.",
        status: "ok",
      });
    }
  }
);

authRouter.post(
  "/reset-password",
  body("resetCode", "Invalid reset code.")
    .isString()
    .isLength({ min: 100, max: 100 }),
  body(
    "newPassword",
    "The password must be at least 8 characters and at most 100 characters long."
  )
    .isString()
    .isLength({ min: 8, max: 100 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new Api400Error({
          name: "InvalidInput",
          message: "Missing or incorrect input data.",
          additionalErrorData: errors.array(),
        })
      );
    }
    const resetCode: string = req.body.resetCode;
    const newPassword: string = req.body.newPassword;
    if (resetCode) {
      try {
        resetPasswordWithCode(newPassword, resetCode);
        res.json({
          message:
            "You're password has been reset. You can now log-in with your new password.",
          status: "ok",
        });
      } catch (err: any) {
        new Api400Error({
          name: err.name,
          message: err.message,
        });
      }
    }
  }
);
