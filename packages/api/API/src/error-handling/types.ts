export enum HTTPStatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER = 500,
}

export interface CustomErrorInterface {
  name: string;
  message: string;
  additionalErrorData?: object;
  statusCode?: HTTPStatusCodes;
  isOperational?: boolean;
}
