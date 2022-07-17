import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "./config";
import UserHandler from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";
import { TokenType } from "@open-decision/prisma";
import { Request } from "express";
import cookie from "cookie";

const cookieExtractor = function (req: Request) {
  let token: string | null = null;
  if (req && req.headers.cookie) {
    const parsedCookies = cookie.parse(req.headers.cookie);
    token = parsedCookies["token"];
  }
  return token;
};

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: JwtPayload, done: Function) => {
    try {
      if (payload.type !== TokenType.ACCESS) {
        throw new Error("Invalid token type");
      }

      const user = await UserHandler.findByUuidOrId(payload.userUuid);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export const jwtWebsocketStrategy = new JwtStrategy(
  {
    secretOrKey: config.ACCESS_TOKEN_SECRET,
    jwtFromRequest: cookieExtractor,
  },
  async (payload: JwtPayload, done: Function) => {
    try {
      if (payload.type !== TokenType.ACCESS) {
        throw new Error("Invalid token type");
      }
      const user = await UserHandler.findByUuidOrId(payload.userUuid);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);
