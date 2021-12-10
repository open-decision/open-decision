import { User } from ".prisma/client";
export enum HTTPStatusCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}

// export enum TokenTypes {
//   ACCESS = "access",
//   REFRESH = "refresh",
//   RESET_PASSWORD = "resetPassword",
//   VERIFY_EMAIL = "verifyEmail",
// }

export interface CustomErrorInterface {
  name?: string;
  message: string;
  additionalErrorData?: object;
  statusCode?: HTTPStatusCodes;
  isOperational?: boolean;
  stack?: string;
}

export interface UserBody extends Partial<User> {
  oldPassword?: string;
}
