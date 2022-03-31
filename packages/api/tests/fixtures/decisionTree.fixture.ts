import { DecisionTree } from "@prisma-client";
import prisma from "../../src/init-prisma-client";
import faker from "faker";
import { userOne, userTwo } from "./user.fixture";

type PartialTree = Pick<
  DecisionTree,
  "uuid" | "name" | "tags" | "treeData" | "ownerUuid"
>;
export const treeOne: PartialTree = {
  uuid: "cfc6ebad-c9d4-4518-8f00-b1c8c83928f0",
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
  uuid: "e10a4f0a-71e5-48ea-91a9-f727829247fc",
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
  uuid: "83032fe2-5f44-4999-867c-d6f3311f95fe",
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
