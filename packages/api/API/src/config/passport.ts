import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "./config";
import { TokenType } from "@prisma/client";
import UserHandler from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

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
