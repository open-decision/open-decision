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
      target: "8edc4369-3906-4dbc-be29-b560c742a806",
      source: "53118f18-a522-4f1d-b2b5-78b306a97651",
    })
  ).toBeFalsy();
});
