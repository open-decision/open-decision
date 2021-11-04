import express, { response } from "express";
import { body, cookie, validationResult } from "express-validator";
import { signup, login, refreshAndStoreNewToken } from "./auth-handler";
import { Api400Error } from "../error-handling/api-errors";

export const authRouter = express.Router();
authRouter.post(
  "/signup",
  body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(),
  body("password", "The password must be at least 8 characters long.").isLength(
    { min: 8, max: 100 }
  ),
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
