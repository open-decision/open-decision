import { treeMock } from "../mocks/tree.mock";
import { disconnectInputAndNode } from "./disconnectInputAndNode";
import { expect, test } from "vitest";
import { Tree } from "../type-classes";
import { clone } from "remeda";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("removeInputFromNode should clear the input from the node of the provided id", () => {
  disconnectInputAndNode(currentTreeMock)(
    "65f93264-6354-4e0b-86c1-3cc9e85db77a",
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(
    currentTreeMock.nodes?.["65f93264-6354-4e0b-86c1-3cc9e85db77a"].inputs
  ).not.toContain("50b7733c-c7ab-4035-b26f-801ea8eca9fe");
});
