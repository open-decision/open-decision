import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "./config";
import UserHandler from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";
import { TokenType } from "@open-decision/prisma";
import { Request } from "express";

const cookieExtractor = function (req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
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
      const user = await UserHandler.findByUuidOrId(payload.sub!);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);
