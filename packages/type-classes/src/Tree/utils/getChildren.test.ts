import { treeMock } from "../mocks/tree.mock";
import { getChildren } from "./getChildren";
import { expect, test } from "vitest";

test("getChildren properly finds children of Node", () => {
  expect(getChildren(treeMock)("e35ba071-6c5f-414f-98b1-a898305e038c")).toEqual(
    [
      "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      "72444c0f-8838-43f6-b395-bf3207386ac2",
    ]
  );
});

test("getChildren returns empty array when nodeId cannot be found", () => {
  expect(getChildren(treeMock)("test")).toEqual([]);
});

test("getChildren returns empty array when no children are found", () => {
  expect(getChildren(treeMock)("65f93264-6354-4e0b-86c1-3cc9e85db77a")).toEqual(
    []
  );
});
