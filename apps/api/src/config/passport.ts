import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "./config";
import { TokenInterface } from "../types/AuthInterfaces";
import { TokenType } from "@prisma/client";

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: TokenInterface, done) => {
    try {
      if (payload.type !== TokenType.ACCESS) {
        throw new Error("Invalid token type");
      }
      const user = { uuid: payload.userUuid };
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
  async (payload: TokenInterface, done) => {
    try {
      if (payload.type !== TokenType.ACCESS) {
        throw new Error("Invalid token type");
      }
      const user = { uuid: payload.userUuid };
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);
