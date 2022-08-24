import { faker } from "@faker-js/faker";
import { DecisionTree } from "@open-decision/prisma";
import prisma from "../client";
import { yDocumentOne } from "./yDocument.fixture";

export type PartialTree = Pick<
  DecisionTree,
  "uuid" | "name" | "yDocument" | "status" | "createdAt" | "updatedAt"
>;

export const createTreeFixture = (
  data?: Partial<PartialTree>
): PartialTree => ({
  uuid: faker.datatype.uuid(),
  name: faker.lorem.words(5),
  yDocument: yDocumentOne,
  status: "ACTIVE",
  createdAt: new Date("2020-01-01T00:00:00.000Z"),
  updatedAt: new Date("2022-01-01T00:00:00.000Z"),
  ...data,
});

export const insertTrees = (userUuid: string, trees: PartialTree[]) =>
  prisma.decisionTree.createMany({
    data: trees.map((tree) => ({ ...tree, ownerUuid: userUuid })),
  });
