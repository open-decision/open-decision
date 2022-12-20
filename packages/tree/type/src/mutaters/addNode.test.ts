import { clone } from "ramda";
import { vi, beforeEach, expect, test } from "vitest";
import { treeMock, emptyTreeMock } from "../mocks/tree.mock";
import { addNode } from "./addNode";
import { createNode } from "../creators";
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
let currentEmptyTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
  currentEmptyTreeMock = clone(emptyTreeMock);
  counter = 0;
});

test("addNode should mutably add a provided Node to the provided tree", () => {
  const newNode = createNode({
    type: "test",
    name: "Testnode",
    inputs: [],
    position: { x: 0, y: 0 },
  });

  addNode(currentTreeMock)(newNode);

  expect(currentTreeMock.nodes).toHaveProperty("1", {
    content: undefined,
    id: 1,
    inputs: [],
    name: "Testnode",
    position: {
      x: 0,
      y: 0,
    },
    type: "test",
  });
});

test("addNode should assign the first created Node as the startNode", () => {
  const newNode = createNode();
  const emptyTree = { startNode: "", nodes: {} };
  addNode(emptyTree)(newNode);

  expect(emptyTree.nodes).toHaveProperty("1", {
    content: undefined,
    data: undefined,
    id: 1,
    inputs: [],
    name: undefined,
    position: {
      x: 0,
      y: 0,
    },
    type: "customNode",
  });

  expect(emptyTree.startNode).toBe(1);
});
