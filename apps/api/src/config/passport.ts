import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "./config";
import UserHandler from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";
import { TokenType } from "@open-decision/prisma";

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: JwtPayload, done) => {
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
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter("auth"),
  },
  async (payload: JwtPayload, done) => {
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
