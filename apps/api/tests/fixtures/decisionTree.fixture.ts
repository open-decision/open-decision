import { DecisionTree } from "@open-decision/prisma";
import prisma from "../../src/init-prisma-client";
import { userOne, userTwo } from "./user.fixture";
import { treeDataOne, yDocumentOne } from "./yDocument.fixture";

type PartialTree = Pick<
  DecisionTree,
  | "uuid"
  | "name"
  | "treeData"
  | "ownerUuid"
  | "yDocument"
  | "treeData"
  | "status"
>;
export const treeOne: PartialTree = {
  uuid: "cfc6ebad-c9d4-4518-8f00-b1c8c83928f0",
  name: "This is the First Tree",
  treeData: treeDataOne,
  yDocument: yDocumentOne,
  status: "ACTIVE",
  ownerUuid: userOne.uuid,
};

export const treeTwo: PartialTree = {
  uuid: "e10a4f0a-71e5-48ea-91a9-f727829247fc",
  name: "This is the Second Tree, which is currently being edited & has an old yDocument",
  treeData: {},
  status: "ACTIVE",
  yDocument: yDocumentOne,
  ownerUuid: userOne.uuid,
};

export const treeThree: PartialTree = {
  uuid: "83032fe2-5f44-4999-867c-d6f3311f95fe",
  name: "This is a foreign Tree",
  status: "ACTIVE",
  yDocument: "",
  treeData: {},
  ownerUuid: userTwo.uuid,
};

export const insertTrees = async (trees: any) => {
  await prisma.decisionTree.createMany({
    data: trees,
  });
};
