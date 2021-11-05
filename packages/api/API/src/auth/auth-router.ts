import express, { response } from "express";
import { body, cookie, validationResult } from "express-validator";
import {
  signup,
  login,
  logout,
  requestPasswordResetMail,
  resetPasswordWithCode,
  refreshAndStoreNewToken,
} from "./auth-functions";
import { Api400Error } from "../error-handling/api-errors";
import isJWT from "validator/lib/isJWT";
import isUUID from "validator/lib/isUUID";
import { LogoutInterface } from "./types/auth-interfaces";

export const authRouter = express.Router();

//Base routes
authRouter.post(
  "/signup",
  body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(),
  body(
    "password",
    "The password must be at least 8 characters and at most 100 characters long."
  ).isLength({ min: 8, max: 100 }),
  async (req, res, next) => {
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
    signupResult = await signup(
      req.body.email,
      req.body.password,
      req.app.locals.prisma
    );

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
  async (req, res, next) => {
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

    const loginResult = await login(
      req.body.email,
      req.body.password,
      req.app.locals.prisma
    );
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

authRouter.post("/logout", async (req, res, next) => {
  const accessToken = req.headers.authorization;
  const refreshToken = req.cookies.refreshCookie;

  const logoutData: LogoutInterface = {
    prisma: req.app.locals.prisma,
  };

  if (accessToken && isJWT(accessToken)) {
    logoutData.accessToken = accessToken;
  }

  if (refreshToken && isUUID(refreshToken)) {
    logoutData.refreshToken = refreshToken;
  }
  //There is no real failing here. If the accessToken is still valid, it's blacklisted. If it's invalid, we don't do anything.
  //If the refreshToken is valid, it's being deleted from the database. If not, we don't do anything.

  await logout(logoutData);
  res.json({ status: "ok" });
});

authRouter.post(
  "/refresh",
  cookie(
    "refreshCookie",
    "Didn't find a valid refreshToken in the refreshCookie."
  ).isUUID(4),

  async (req, res, next) => {
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

      const refreshHandlerReturn = await refreshAndStoreNewToken(
        refreshToken,
        req.app.locals.prisma
      );

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
authRouter.get("/profile", async (req, res, next) => {});

authRouter.post("/settings/password", async (req, res, next) => {});

authRouter.post("/settings/email", async (req, res, next) => {});

//Reset password routes
authRouter.post(
  "/request-password-reset/",
  body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(),
  async (req, res, next) => {
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
      requestPasswordResetMail(req.body.email, req.app.locals.prisma);
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
  async (req, res, next) => {
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
        resetPasswordWithCode(newPassword, resetCode, req.app.locals.prisma);
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
