import { tokenService } from "../../src/services/token.service";

export const getAccessToken = async (uuid: string) => {
  const token = await tokenService.generateAccessToken(uuid);
  return token.token;
};
