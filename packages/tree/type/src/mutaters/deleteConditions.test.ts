import { clone } from "ramda";
import { treeMock } from "../mocks/tree.mock";
import { deleteConditions } from "./deleteConditions";
import { expect, beforeEach, test } from "vitest";
import { Tree } from "../type-classes";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("deleteConditions should properly delete a condition", () => {
  deleteConditions(currentTreeMock)(["9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"]);

  expect(currentTreeMock.conditions).not.toHaveProperty(
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );

  expect(currentTreeMock.edges).toHaveProperty(
    "3abeee1c-9662-4af5-a232-037228949002"
  );

  expect(currentTreeMock.edges).toHaveProperty(
    "5aef09a9-ddde-4913-b139-e28421a7ada0"
  );
});

test("deleteConditions should delete all edges related to the removed condition", () => {
  deleteConditions(currentTreeMock)(["ff9accd5-a509-4071-a503-a2ae6e2d3d7c"]);

  expect(currentTreeMock.edges).not.toHaveProperty(
    "3abeee1c-9662-4af5-a232-037228949002"
  );

  expect(currentTreeMock.edges).not.toHaveProperty(
    "5aef09a9-ddde-4913-b139-e28421a7ada0"
  );
});

test("deleteConditions should not fail and not delete anything when a passed in conditionId has not been found", () => {
  deleteConditions(currentTreeMock)(["test"]);

  expect(currentTreeMock.conditions).toHaveProperty(
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );

  expect(currentTreeMock.conditions).toHaveProperty(
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c"
  );
});
