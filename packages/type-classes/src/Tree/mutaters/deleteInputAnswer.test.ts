import { clone } from "ramda";
import { vi, test, expect, beforeEach } from "vitest";
import { treeMock } from "../mocks/tree.mock";
import { deleteInputAnswer } from "./deleteInputAnswer";

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

test("addInputAnswer should mutably add a provided answer to the input of the provided id", () => {
  deleteInputAnswer(currentTreeMock)(
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
    "Nein"
  );

  expect(currentTreeMock.inputs["50b7733c-c7ab-4035-b26f-801ea8eca9fe"])
    .toMatchInlineSnapshot(`
      {
        "answers": [],
        "id": "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
        "type": "select",
      }
    `);
});
