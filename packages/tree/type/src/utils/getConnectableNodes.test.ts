import { treeMock } from "../mocks/tree.mock";
import { getConnectableNodes } from "./getConnectableNodes";
import { expect, test } from "vitest";

test("getConnectableNodes returns array of node ids that are valid to connect.", () => {
  expect(
    getConnectableNodes(treeMock)("e35ba071-6c5f-414f-98b1-a898305e038c")
  ).toEqual([
    "65f93264-6354-4e0b-86c1-3cc9e85db77a",
    "72444c0f-8838-43f6-b395-bf3207386ac2",
    "9716912b-a124-4148-9faf-afb04629aca1",
    "8edc4369-3906-4dbc-be29-b560c742a806",
  ]);

  expect(
    getConnectableNodes(treeMock)("72444c0f-8838-43f6-b395-bf3207386ac2")
  ).toEqual([
    "9716912b-a124-4148-9faf-afb04629aca1",
    "8edc4369-3906-4dbc-be29-b560c742a806",
  ]);
});
