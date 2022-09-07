import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { connectConditionAndNode } from "./connectConditionAndNode";
import { expect, test, beforeEach } from "vitest";

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("relateConditionToEdge should add an existing conditionId to the edge of the provided id", () => {
  connectConditionAndNode(currentTreeMock)(
    "72444c0f-8838-43f6-b395-bf3207386ac2",
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );

  expect(currentTreeMock.nodes).toMatchInlineSnapshot(`
      {
        "65f93264-6354-4e0b-86c1-3cc9e85db77a": {
          "data": {
            "conditions": [
              "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
            ],
            "content": [],
            "inputs": [
              "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
            ],
            "name": "Zweiter Knoten",
          },
          "id": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
          "position": {
            "x": 0,
            "y": 0,
          },
          "type": "customNode",
        },
        "72444c0f-8838-43f6-b395-bf3207386ac2": {
          "data": {
            "conditions": [
              "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
              "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
            ],
            "content": [],
            "inputs": [
              "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
            ],
            "name": "Dritter Knoten",
          },
          "id": "72444c0f-8838-43f6-b395-bf3207386ac2",
          "position": {
            "x": 0,
            "y": 0,
          },
          "type": "customNode",
        },
        "e35ba071-6c5f-414f-98b1-a898305e038c": {
          "data": {
            "conditions": [
              "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
            ],
            "content": [],
            "inputs": [
              "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
            ],
            "name": "Erster Knoten",
          },
          "id": "e35ba071-6c5f-414f-98b1-a898305e038c",
          "position": {
            "x": 0,
            "y": 0,
          },
          "type": "customNode",
        },
      }
    `);
});

test("relateConditionToEdge should return an Error if the edge could not be found and not change the tree", () => {
  const error = connectConditionAndNode(currentTreeMock)(
    "test",
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );

  expect(error).toBeInstanceOf(Error);
  expect(currentTreeMock).toMatchObject(currentTreeMock);
});

test("relateConditionToEdge should return an Error if the condition could not be found and not change the tree", () => {
  const error = connectConditionAndNode(currentTreeMock)(
    "72444c0f-8838-43f6-b395-bf3207386ac2",
    "test"
  );
  expect(error).toBeInstanceOf(Error);
  expect(currentTreeMock).toMatchObject(currentTreeMock);
});
