import { clone } from "ramda";
import { vi, beforeEach, expect, test } from "vitest";
import { treeMock } from "../mocks/tree.mock";
import { addInput } from "./addInput";
import { createInput } from "../creators";
import { Tree } from "../type-classes";

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

test("addInput should mutably add a provided Input to the provided tree", () => {
  const newInput = createInput({ type: "test" });
  addInput(currentTreeMock)(newInput);

  expect(currentTreeMock.inputs).toHaveProperty("1", {
    id: 1,
    type: "test",
  });
});
