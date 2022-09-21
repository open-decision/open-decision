import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { deleteEdges } from "./deleteEdges";
import { beforeEach, expect, test } from "vitest";
import { Tree } from "../type-classes";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("deleteEdges should properly delete an edge", () => {
  deleteEdges(currentTreeMock)(["3abeee1c-9662-4af5-a232-037228949002"]);

  expect(currentTreeMock.edges).not.toHaveProperty(
    "3abeee1c-9662-4af5-a232-037228949002"
  );
});

test("deleteEdges should not fail and delete nothing when a passed in edgeId has not been found", () => {
  deleteEdges(currentTreeMock)(["test"]);

  expect(currentTreeMock.edges).toHaveProperty(
    "3abeee1c-9662-4af5-a232-037228949002"
  );
  expect(currentTreeMock.edges).toHaveProperty(
    "5aef09a9-ddde-4913-b139-e28421a7ada0"
  );
});
