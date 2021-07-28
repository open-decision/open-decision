export interface TokenInterface {
  userUuid: string;
  iat: number;
  exp: number;
}

interface ErrorWithStatus extends Error {
  status?: number;
}
