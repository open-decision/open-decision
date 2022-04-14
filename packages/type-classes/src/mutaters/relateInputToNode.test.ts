import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { relateInputToNode } from "./relateInputToNode";
import { expect, test, beforeEach } from "vitest";

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("relateInputToNode should add an existing inputId to the node of the provided id", () => {
  relateInputToNode(currentTreeMock)(
    "72444c0f-8838-43f6-b395-bf3207386ac2",
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
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
            ],
            "content": [],
            "inputs": [
              "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
              "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
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

test("relateInputToNode should return an Error if the node could not be found and not change the tree", () => {
  const error = relateInputToNode(currentTreeMock)(
    "test",
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(error).toBeInstanceOf(Error);
  expect(currentTreeMock).toMatchObject(currentTreeMock);
});

test("relateInputToNode should return an Error if the input could not be found and not change the tree", () => {
  const error = relateInputToNode(currentTreeMock)(
    "72444c0f-8838-43f6-b395-bf3207386ac2",
    "test"
  );
  expect(error).toBeInstanceOf(Error);
  expect(currentTreeMock).toMatchObject(currentTreeMock);
});
