import { faker } from "@faker-js/faker";
import { DecisionTree } from "@prisma/client";
import prisma from "../utils/prismaClient";
import { auroaYDoc } from "@open-decision/tree-type";

export type PartialTree = Pick<
  DecisionTree,
  | "uuid"
  | "name"
  | "yDocument"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "hasPreview"
>;

export const createTreeFixture = (
  data?: Partial<PartialTree>
): PartialTree => ({
  uuid: faker.datatype.uuid(),
  name: faker.lorem.words(5),
  yDocument: auroaYDoc,
  status: "ACTIVE",
  createdAt: new Date("2020-01-01T00:00:00.000Z"),
  updatedAt: new Date("2022-01-01T00:00:00.000Z"),
  hasPreview: false,
  ...data,
});

export const insertTrees = async (userUuid: string, trees: PartialTree[]) =>
  await prisma.decisionTree.createMany({
    data: trees.map((tree) => ({ ...tree, ownerUuid: userUuid })),
  });
