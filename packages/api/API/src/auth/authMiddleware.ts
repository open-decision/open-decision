import express, { Request, Response, NextFunction } from "express";
import { verifyAccessTokenAndGetUserId } from "./generateAndVerifyToken";

interface ErrorWithStatus extends Error {
  status?: number;
}

export const isAuthorized = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("JWT ", "");
      if (token) {
        const userId = verifyAccessTokenAndGetUserId(
          token,
          req.app.locals.prisma
        );
        if (userId) {
          // If everything is okay, continue
          res.locals.authenticated = userId;
          return next();
        }
      }
    }
    // Return error, if any of the steps fails
    const err: ErrorWithStatus = new Error("Not authorized.");
    err.status = 400;
    return next(err);
  }
};
