import { clone } from "ramda";
import { vi, beforeEach, expect, test } from "vitest";
import { treeMock } from "../mocks/tree.mock";
import { addInput, createAndAddInput } from "./addInput";
import { createInput } from "../creators";

vi.mock("uuid", () => {
  let counter = 0;
  return {
    v4: vi.fn(() => {
      ++counter;
      return counter;
    }),
  };
});

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("addInput should mutably add a provided Input to the provided tree", () => {
  const newInput = createInput();
  addInput(currentTreeMock)(newInput);

  expect(currentTreeMock.inputs).toMatchInlineSnapshot(`
    {
      "1": {
        "answers": [],
        "id": 1,
        "type": "select",
      },
      "50b7733c-c7ab-4035-b26f-801ea8eca9fe": {
        "answers": [
          {
            "id": "1",
            "text": "Ja",
          },
        ],
        "id": "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
        "type": "select",
      },
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

test("createAndAddInput should add a new Input to the provided tree", () => {
  createAndAddInput(currentTreeMock)({ answers: [] });

  expect(currentTreeMock.inputs).toMatchInlineSnapshot(`
    {
      "2": {
        "answers": [],
        "id": 2,
        "type": "select",
      },
      "50b7733c-c7ab-4035-b26f-801ea8eca9fe": {
        "answers": [
          {
            "id": "1",
            "text": "Ja",
          },
        ],
        "id": "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
        "type": "select",
      },
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
