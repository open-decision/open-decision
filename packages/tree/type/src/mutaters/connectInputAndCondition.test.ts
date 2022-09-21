import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { connectInputAndCondition } from "./connectInputAndCondition";
import { expect, test, beforeEach } from "vitest";
import { Tree } from "../type-classes";
import { ODProgrammerError } from "@open-decision/type-classes";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("relateInputToCondition should add an existing inputId to the condition of the provided id", () => {
  connectInputAndCondition(currentTreeMock)(
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(currentTreeMock.conditions).toHaveProperty(
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
    {
      data: {
        answerId: "dfec1b30-fc51-43a6-9e6f-db71933a8274",
      },
      id: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
      inputId: "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
      type: "select",
    }
  );
});
