import { User, TokenType } from "@open-decision/prisma";

export interface TokenInterface {
  userUuid: string;
  type: TokenType;
  iat: number;
  exp: number;
}
export interface LogoutInterface {
  user?: User;
  accessToken?: string | null;
  refreshToken?: string | null;
}

interface ErrorWithStatus extends Error {
  status?: number;
}
