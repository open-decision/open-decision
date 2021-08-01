import { Prisma, PrismaClient, User } from "@prisma/client";
import { UUID } from "../types/uuid-class";
import { NewTreeInput } from "./input-arguments-types";

export class TreeService {
  async findById(id: string, userUuid: UUID, prisma: PrismaClient) {
    return prisma.decisionTree.findMany({
      where: { owner: { uuid: userUuid.toString() } },
    });
  }

  async findAll(userUuid: UUID, prisma: PrismaClient) {
    return prisma.decisionTree.findMany({
      where: { owner: { uuid: userUuid.toString() } },
    });
  }

  async addNew(
    newTreeData: NewTreeInput,
    userUuid: UUID,
    prisma: PrismaClient
  ) {
    return prisma.decisionTree.create({
      data: {
        ...newTreeData,
        owner: { connect: { uuid: userUuid.toString() } },
        tags: JSON.parse(newTreeData.tags || "{}"),
        treeData: JSON.parse(newTreeData.treeData || "{}"),
      },
    });
  }
}
