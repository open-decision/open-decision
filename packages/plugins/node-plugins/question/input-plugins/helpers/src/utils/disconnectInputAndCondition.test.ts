import { treeMock } from "@open-decision/tree-type/src/mocks/tree.mock";
import { disconnectInputAndCondition } from "./disconnectInputAndCondition";
import { expect, test } from "vitest";
import { Tree } from "@open-decision/tree-type/src/type-classes";
import { clone } from "remeda";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("removeInputFromNode should clear the input from the node of the provided id", () => {
  disconnectInputAndCondition(currentTreeMock)(
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );

  expect(
    currentTreeMock.conditions?.["9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"]
  ).not.toHaveProperty("inputId");
});
