import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { deleteNodes } from "./deleteNodes";
import { expect, test, beforeEach } from "vitest";

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("deleteNodes should properly delete the node", () => {
  deleteNodes(currentTreeMock)(["65f93264-6354-4e0b-86c1-3cc9e85db77a"]);

  expect(currentTreeMock.nodes).not.toHaveProperty(
    "65f93264-6354-4e0b-86c1-3cc9e85db77a"
  );
});

test("deleteNodes should remove all edges using the node as a source or target", () => {
  deleteNodes(currentTreeMock)(["65f93264-6354-4e0b-86c1-3cc9e85db77a"]);

  expect(currentTreeMock.edges).toMatchInlineSnapshot("{}");
});

test("deleteNodes should remove all inputs related to the node", () => {
  deleteNodes(currentTreeMock)(["65f93264-6354-4e0b-86c1-3cc9e85db77a"]);

  expect(currentTreeMock.inputs).toMatchInlineSnapshot(`
    {
      "7adcfc07-cefd-45a8-ba42-c19860eb26c5": {
        "answers": [
          {
            "id": "3c5827b3-2565-4623-850b-de463a5ee946",
            "text": "Nein",
          },
          {
            "id": "dfec1b30-fc51-43a6-9e6f-db71933a8274",
            "text": "Vielleicht",
          },
        ],
        "id": "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
        "type": "select",
      },
    }
  `);
});
