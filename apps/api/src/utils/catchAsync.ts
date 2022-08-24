import { NextFunction, Request, Response } from "express";

const catchAsync =
  (fn: (req, res, next) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export default catchAsync;
