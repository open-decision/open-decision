import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { connectInputAndNode } from "./connectInputAndNode";
import { expect, test, beforeEach } from "vitest";
import { Tree } from "../type-classes";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("relateInputToNode should add an existing inputId to the node of the provided id", () => {
  connectInputAndNode(currentTreeMock)(
    "72444c0f-8838-43f6-b395-bf3207386ac2",
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(
    currentTreeMock.nodes?.["72444c0f-8838-43f6-b395-bf3207386ac2"].inputs
  ).toContain("50b7733c-c7ab-4035-b26f-801ea8eca9fe");
});
