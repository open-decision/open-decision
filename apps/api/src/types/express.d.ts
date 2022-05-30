import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user: import("@open-decision/models/prisma-client").User;
  }
}
