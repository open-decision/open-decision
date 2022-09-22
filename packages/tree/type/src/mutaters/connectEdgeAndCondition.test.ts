import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { connectEdgeAndCondition } from "./connectEdgeAndCondition";
import { expect, test, beforeEach } from "vitest";
import { Tree } from "../type-classes";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("connectEdgeAndCondition should add an existing conditionId to the edge of the provided id", () => {
  connectEdgeAndCondition(currentTreeMock)(
    "a176bb34-4c55-413e-acae-016880b682ec",
    "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f"
  );

  expect(
    currentTreeMock.edges?.["a176bb34-4c55-413e-acae-016880b682ec"]
  ).toHaveProperty("conditionId", "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f");
});
