import { Request, Response, NextFunction } from "express";
import * as http from "http";
import passport from "passport";
import { Permissions, roleRights } from "../config/roles";
import { User } from "@open-decision/prisma";
import { jwtStrategy, jwtWebsocketStrategy } from "../config/passport";
import { APIError } from "@open-decision/type-classes";

const verifyCallback =
  (
    req: Request | http.IncomingMessage,
    resolve,
    reject,
    requiredRights: Permissions[]
  ) =>
  async (err: any, user: User, info: any) => {
    if (err || info || !user) {
      return reject(
        new APIError({
          code: "UNAUTHORIZED",
          message: "Please authenticate",
        })
      );
    }

    if (!("user" in req)) {
      req["user"] = user;
    } else {
      req.user = user;
    }

    if (requiredRights.length !== 0) {
      const userRights = roleRights.get(user.role) ?? [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (
        !hasRequiredRights &&
        "params" in req &&
        req.params.userUuid !== user.uuid
      ) {
        return reject(
          new APIError({
            code: "FORBIDDEN",
            message: "User is not allowed to request this ressource.",
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
        jwtStrategy,
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export const wsAuth = async (req: http.IncomingMessage, next) => {
  return (
    new Promise((resolve, reject) => {
      passport.authenticate(
        jwtWebsocketStrategy,
        { session: false },
        verifyCallback(req, resolve, reject, [])
      )(req, next);
    })
      //@ts-expect-error - whatever
      .then(() => next(false, req.user))
      .catch((err) => next(err))
  );
};
