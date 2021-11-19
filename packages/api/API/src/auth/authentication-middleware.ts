import express, { Request, Response, NextFunction } from "express";
import { verifyAccessTokenAndGetUserUuid } from "./utils/generate-and-verifyToken";
import { header, validationResult } from "express-validator";
import { Api400Error, Api401Error } from "./../error-handling/api-errors";
import { isAccessTokenBlocked } from "./utils/access-token-blocklist";

const checkAuthorization = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Api400Error({
        name: "InvalidInput",
        message: "Missing or incorrect Authorization header.",
        additionalErrorData: errors.array(),
      })
    );
  }
  const token = req.headers.authorization!;
  let userUuid;
  try {
    userUuid = verifyAccessTokenAndGetUserUuid(token);
    const tokenIsBlocked = await isAccessTokenBlocked(token);
    if (!tokenIsBlocked) {
      // If everything is okay, continue
      res.context.userUuid = userUuid;
      return next();
    } else {
      return next(
        new Api401Error({
          name: "InvalidAccessToken",
          message: "Invalid Access Token.",
        })
      );
    }
  } catch (err: any) {
    // Return error if any of the steps fails
    return next(
      new Api401Error({
        name: err.name,
        message: err.message || "Invalid Access Token.",
      })
    );
  }
};

export const isAuthorized = [
  header(
    "Authorization",
    "Did not find a valid JWT in Authorization header."
  ).isJWT(),
  checkAuthorization,
];
