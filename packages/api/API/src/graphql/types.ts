import { PrismaClient, User } from "@prisma/client";

export interface GqlContext {
  user: User;
  prisma: PrismaClient;
}
