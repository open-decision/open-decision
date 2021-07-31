import { Prisma } from "@prisma/client";

export class TreeService {
  findById(user: Prisma.UserSelect, id: string, context: any) {
    if (!user) {
      throw new Error("Unauthorized");
    } else {
      return context.prisma.decisionTree.findMany({
        where: { owner: { uuid: user.uuid } },
      });
    }
  }
}
