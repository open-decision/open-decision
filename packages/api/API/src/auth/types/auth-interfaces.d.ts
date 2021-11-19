import { PrismaClient, User } from ".prisma/client";

export interface TokenInterface {
  userUuid: string;
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
