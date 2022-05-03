import { treeMock } from "../mocks/tree.mock";
import { isCircular } from "./isCircular";
import { expect, test } from "vitest";

test("isCircular finds a circular edge.", () => {
  expect(
    isCircular(treeMock)({
      source: "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      target: "e35ba071-6c5f-414f-98b1-a898305e038c",
    })
  ).toBeTruthy();
});

test("isCircular finds a circular edge.", () => {
  expect(
    isCircular(treeMock)({
      target: "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      source: "72444c0f-8838-43f6-b395-bf3207386ac2",
    })
  ).toBeFalsy();
});
