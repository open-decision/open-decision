import { PrismaClient, User } from "@open-decision/models/prisma-client";

export interface GqlContext {
  user: User;
  prisma: PrismaClient;
}
