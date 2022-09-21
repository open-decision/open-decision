import { clone } from "remeda";
import { vi, beforeEach, test, expect } from "vitest";
import { createCondition } from "../creators";
import { treeMock } from "../mocks/tree.mock";
import { Tree } from "../type-classes";
import { addCondition } from "./addCondition";

let counter = 0;
vi.mock("uuid", () => {
  return {
    v4: vi.fn(() => {
      ++counter;
      return counter;
    }),
  };
});

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
  counter = 0;
});

test("addCondition should mutably add a provided Condition to the provided tree", () => {
  const newCondition = createCondition({ type: "test" });
  addCondition(currentTreeMock)(newCondition);

  expect(currentTreeMock.conditions).toHaveProperty("1", {
    id: 1,
    type: "test",
  });
});
