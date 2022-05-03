import { test, expect, describe } from "vitest";
import { mietminderungTreeMock, treeMock } from "@open-decision/type-classes";
import { createInterpreterMachine } from "./interpreter";
import { interpret } from "xstate";

const userAnswer = {
  type: "ADD_USER_ANSWER",
  inputId: "cbca524c-4b3d-4a99-a85c-68f8d57487c2",
  answerId: "9675cc27-b1a3-4dfe-a759-0eff5e7a2cf3",
} as const;

const userAnswer2 = {
  type: "ADD_USER_ANSWER",
  inputId: "49f7bbaa-f58c-4310-9137-b19fd89d4848",
  answerId: "8d0946ab-5934-4bb7-8203-d1cb41b73aba",
} as const;

test("Sending ADD_USER_ANSWER should add the answer to context or override the existing answer in context", () => {
  const interpreterService = interpret(
    createInterpreterMachine(treeMock)
  ).start();

  interpreterService.send(userAnswer);

  interpreterService.send(userAnswer);

  interpreterService.send(userAnswer2);

  expect(interpreterService.state.context.answers).toMatchInlineSnapshot(`
    {
      "49f7bbaa-f58c-4310-9137-b19fd89d4848": "8d0946ab-5934-4bb7-8203-d1cb41b73aba",
      "cbca524c-4b3d-4a99-a85c-68f8d57487c2": "9675cc27-b1a3-4dfe-a759-0eff5e7a2cf3",
    }
  `);
});

test("Sending RESET should set the machines context back to its empty values and end in idle state", () => {
  const interpreterService = interpret(
    createInterpreterMachine(treeMock)
  ).start();

  interpreterService.send(userAnswer);

  interpreterService.send("RESET");

  expect(interpreterService.state.matches("idle")).toBeTruthy();
  expect(interpreterService.state.context).toMatchInlineSnapshot(`
    {
      "Error": undefined,
      "answers": {},
      "history": {
        "nodes": [
          "e35ba071-6c5f-414f-98b1-a898305e038c",
        ],
        "position": 0,
      },
    }
  `);
});

describe("The state machines history", () => {
  //The following tests all build on each other
  const interpreterService = interpret(
    createInterpreterMachine(mietminderungTreeMock)
  ).start();

  test("Sending GO_BACK when no history exists should not do anything", () => {
    interpreterService.send("GO_BACK");

    expect(interpreterService.state.context.history.position).toBe(0);
  });

  test("Sending GO_FORWARD when no history exists should not do anything", () => {
    interpreterService.send("GO_FORWARD");

    expect(interpreterService.state.context.history.position).toBe(0);
  });

  test("Sending GO_BACK should move the history.position one step backwards", () => {
    interpreterService.send(userAnswer);

    interpreterService.send({
      type: "EVALUATE_NODE_CONDITIONS",
      conditionIds: ["c0df5a50-7ab9-4232-97d3-40923b850dda"],
    });

    interpreterService.send("GO_BACK");

    expect(interpreterService.state.context.history).toMatchInlineSnapshot(`
      {
        "nodes": [
          "2ccf5f67-3149-4434-a5d6-51760b48fe2f",
          "ba80a8f1-f2bb-4636-b936-9b343903b060",
        ],
        "position": 1,
      }
    `);
  });

  test("Sending GO_BACK should not go further back then history node entries", () => {
    interpreterService.send("GO_BACK");

    expect(interpreterService.state.context.history.position).toBe(1);
    expect(interpreterService.state.context.history.nodes).toHaveLength(2);
  });

  test("Sending GO_FORWARD should move the history.position one step forwards", () => {
    interpreterService.send("GO_FORWARD");

    expect(interpreterService.state.context.history.position).toBe(0);
  });

  test("Sending GO_FORWARD should not go further forward then 0", () => {
    interpreterService.send("GO_FORWARD");

    expect(interpreterService.state.context.history.position).toBe(0);
  });
});
