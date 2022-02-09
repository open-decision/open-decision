import { DecisionTree } from "@prisma/client";
import prisma from "../../src/init-prisma-client";
import faker from "faker";
import { userOne, userTwo } from "./user.fixture";

type PartialTree = Pick<
  DecisionTree,
  "id" | "name" | "tags" | "treeData" | "ownerUuid"
>;
export const treeOne: PartialTree = {
  id: 1,
  name: "This is the First Tree",
  tags: [
    {
      name: "Tenancy Law",
      color: "red",
      kind: "user",
    },
  ],
  treeData: {},
  ownerUuid: userOne.uuid,
};

export const treeTwo: PartialTree = {
  id: 2,
  name: "This is the Second Tree",
  tags: [
    {
      name: "Archived",
      color: "yellow",
      kind: "system",
    },
  ],
  treeData: {},
  ownerUuid: userOne.uuid,
};

export const treeThree: PartialTree = {
  id: 3,
  name: "This is a foreign Tree",
  tags: [
    {
      name: "Criminal Law",
      color: "blue",
      kind: "user",
    },
  ],
  treeData: {},
  ownerUuid: userTwo.uuid,
};

export const insertTrees = async (trees: any) => {
  await prisma.decisionTree.createMany({
    data: trees,
  });
};
