import { UUID } from "../uuid-class";
import { PrismaClient } from "prisma/prisma-client";

interface ReqLocals {
  prisma?: PrismaClient;
}

interface ResLocals {
  userUuid?: UUID;
}

declare module "express" {
  interface Request {
    app: {
      locals: ReqLocals;
    };
  }
  interface Response {
    locals: ResLocals;
  }
}
