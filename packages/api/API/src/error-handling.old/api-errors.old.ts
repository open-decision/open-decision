import { BaseError } from "../utils/ApiError";
import { HTTPStatusCodes, CustomErrorInterface } from "../types/types";

export class Api400Error extends BaseError {
  constructor({
    name = "Bad Request",
    message = "Please check your inputs again.",
    additionalErrorData,
    statusCode = HTTPStatusCodes.BAD_REQUEST,
    isOperational,
  }: CustomErrorInterface) {
    super({
      name,
      message,
      additionalErrorData,
      statusCode,
      isOperational,
    });
  }
}

export class Api401Error extends BaseError {
  constructor({
    name = "Unauthorized",
    message = "You are not authorized.",
    additionalErrorData,
    statusCode = HTTPStatusCodes.UNAUTHORIZED,
    isOperational,
  }: CustomErrorInterface) {
    super({
      name,
      message,
      additionalErrorData,
      statusCode,
      isOperational,
    });
  }
}

// export class Api404Error extends BaseError {
//   constructor(
//     name: string,
//     statusCode = HTTPStatusCodes.NOT_FOUND,
//     description = "Not found.",
//     isOperational = true
//   ) {
//     super(name, statusCode, isOperational, description);
//   }
// }
