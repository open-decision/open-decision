import { NextFunction, Request, Response } from "express";

const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

// FIXME - why is this working? Research and type correctly
export const catchAsyncWebsocket =
  (fn: (req: any, socket: any, head: any) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export default catchAsync;
