import { User, TokenType } from ".prisma/client";

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
  statusCode?: number;
  isOperational?: boolean;
  stack?: string;
}

export interface UserBody extends Partial<User> {
  oldPassword?: string;
}

export interface FindTokenInterface {
  token: string;
  type: TokenType;
  blacklisted?: boolean;
  ownerUuid?: string;
}
