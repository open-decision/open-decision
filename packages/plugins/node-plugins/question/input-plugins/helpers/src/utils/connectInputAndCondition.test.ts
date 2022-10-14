import { clone } from "remeda";
import { treeMock } from "@open-decision/tree-type/src/mocks/tree.mock";
import { connectInputAndCondition } from "./connectInputAndCondition";
import { expect, test, beforeEach } from "vitest";
import { Tree } from "@open-decision/tree-type/src/type-classes";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("relateInputToCondition should add an existing inputId to the condition of the provided id", () => {
  connectInputAndCondition(currentTreeMock)(
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(
    currentTreeMock.conditions?.["ff9accd5-a509-4071-a503-a2ae6e2d3d7c"]
  ).toHaveProperty("inputId", "50b7733c-c7ab-4035-b26f-801ea8eca9fe");
});
