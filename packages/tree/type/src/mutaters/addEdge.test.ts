import { clone } from "remeda";
import { vi, beforeEach, test, expect } from "vitest";
import { Tree } from "../type-classes";
import { treeMock } from "../mocks/tree.mock";
import { addEdge } from "./addEdge";
import { createEdge } from "../creators";

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

test("addEdge should mutably add a provided Edge to the provided tree", () => {
  const newEdge = createEdge(currentTreeMock)({
    source: "8edc4369-3906-4dbc-be29-b560c742a806",
    target: "53118f18-a522-4f1d-b2b5-78b306a97651",
    conditionId: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
  });

  if (newEdge instanceof Error) throw newEdge;

  addEdge(currentTreeMock)(newEdge);

  expect(currentTreeMock.edges).toHaveProperty("1", {
    conditionId: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
    id: 1,
    source: "8edc4369-3906-4dbc-be29-b560c742a806",
    target: "53118f18-a522-4f1d-b2b5-78b306a97651",
    type: "default",
  });
});
