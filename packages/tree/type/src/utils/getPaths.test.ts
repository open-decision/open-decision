import { treeMock } from "../mocks/tree.mock";
import { createAdjacencyList, depthFirstSearch, getPaths } from "./getPaths";
import { expect, test } from "vitest";

const adjacencyList = createAdjacencyList(Object.values(treeMock.edges ?? {}));

test("createAdjacencyList creates a valid adjacency list", () => {
  expect(adjacencyList).toEqual({
    "53118f18-a522-4f1d-b2b5-78b306a97651": [],
    "65f93264-6354-4e0b-86c1-3cc9e85db77a": [
      "e35ba071-6c5f-414f-98b1-a898305e038c",
    ],
    "72444c0f-8838-43f6-b395-bf3207386ac2": [
      "e35ba071-6c5f-414f-98b1-a898305e038c",
      "65f93264-6354-4e0b-86c1-3cc9e85db77a",
    ],
    "9716912b-a124-4148-9faf-afb04629aca1": [
      "72444c0f-8838-43f6-b395-bf3207386ac2",
    ],
    "e35ba071-6c5f-414f-98b1-a898305e038c": [
      "53118f18-a522-4f1d-b2b5-78b306a97651",
    ],
  });
});

test("depthFirstSearch finds all valid paths", () => {
  expect(
    depthFirstSearch("65f93264-6354-4e0b-86c1-3cc9e85db77a", adjacencyList)
  ).toEqual([
    [
      "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      "e35ba071-6c5f-414f-98b1-a898305e038c",
      "53118f18-a522-4f1d-b2b5-78b306a97651",
    ],
  ]);
});

test("getPaths returns all valid paths", () => {
  expect(getPaths(treeMock)("e35ba071-6c5f-414f-98b1-a898305e038c")).toEqual([
    [
      "e35ba071-6c5f-414f-98b1-a898305e038c",
      "53118f18-a522-4f1d-b2b5-78b306a97651",
    ],
  ]);
  expect(getPaths(treeMock)("65f93264-6354-4e0b-86c1-3cc9e85db77a")).toEqual([
    [
      "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      "e35ba071-6c5f-414f-98b1-a898305e038c",
      "53118f18-a522-4f1d-b2b5-78b306a97651",
    ],
  ]);
});
