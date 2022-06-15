import { tokenService } from "../../src/services/token.service";
import { userOne, admin } from "./user.fixture";

export const userOneAccessToken = tokenService.generateAccessToken(
  userOne.uuid
).token;
export const adminAccessToken = tokenService.generateAccessToken(
  admin.uuid
).token;
