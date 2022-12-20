import { treeMock, emptyTreeMock } from "../mocks/tree.mock";
import { getParents } from "./getParents";
import { expect, test } from "vitest";

test("getParents properly finds parents", () => {
  expect(getParents(treeMock)("65f93264-6354-4e0b-86c1-3cc9e85db77a")).toEqual([
    "e35ba071-6c5f-414f-98b1-a898305e038c",
  ]);
});

test("getParents returns empty array when the passed nodeId is not found", () => {
  expect(
    getParents(emptyTreeMock)("65f93264-6354-4e0b-86c1-3cc9e85db77a")
  ).toEqual([]);
});

test("getParents return empty array when no parents are found", () => {
  expect(getParents(treeMock)("8edc4369-3906-4dbc-be29-b560c742a806")).toEqual(
    []
  );
});
