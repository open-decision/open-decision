import { Request } from "express";
import { NextFunction, Response } from "express-serve-static-core";
import passport from "passport";
import { Permissions, roleRights } from "../config/roles";
import UserHandler from "../models/user.model";
import { User } from "@prisma/client";
import ApiError from "../utils/ApiError";
import { HTTPStatusCodes } from "../types/types";
namespace Express {
  export interface Request {
    user?: User;
  }
}

const verifyCallback =
  (
    req: Request,
    resolve: Function,
    reject: Function,
    requiredRights: Permissions[]
  ) =>
  async (err: any, user: User, info: any) => {
    if (err || info || !user) {
      return reject(
        new ApiError({
          statusCode: HTTPStatusCodes.UNAUTHORIZED,
          message: "Please authenticate",
        })
      );
    }
    req.user = user;

    if (requiredRights.length !== 0) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights!.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userUUId !== user.uuid) {
        return reject(
          new ApiError({
            statusCode: HTTPStatusCodes.FORBIDDEN,
            message: "Forbidden",
          })
        );
      }
    }

    resolve();
  };

export const auth =
  (...requiredRights: Permissions[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
