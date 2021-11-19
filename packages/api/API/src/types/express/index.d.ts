import { UUID } from "../uuid-class";
import { PrismaClient } from "prisma/prisma-client";
import { Express } from "express-serve-static-core";

// interface ReqLocals {
//   prisma?: PrismaClient;
// }
interface Context {
  userUuid?: UUID;
}

declare global {
  namespace Express {
    interface Response {
      context: Context;
    }
  }
}
