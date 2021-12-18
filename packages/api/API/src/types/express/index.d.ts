import { UUID } from "../uuid-class";
import { PrismaClient, User as PrismaUser } from "prisma/prisma-client";
import { Express } from "express-serve-static-core";

// interface ReqLocals {
//   prisma?: PrismaClient;
// }
interface Context {
  userUuid?: UUID;
}

// declare module "express" {
//   interface Request {
//     user?: PrismaUser;
//   }
// }
