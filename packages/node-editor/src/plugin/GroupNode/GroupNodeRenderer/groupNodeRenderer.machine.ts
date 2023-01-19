import { canGoBackInArray, canGoForwardInArray } from "@open-decision/utils";
import { TModuleVariableValue } from "@open-decision/variables";
import { createMachine, assign } from "xstate";

export type GroupNodeRendererContext = {
  iterations: TModuleVariableValue[];
  position: number;
};

export const getCurrentIteration = (context: GroupNodeRendererContext) =>
  context.iterations[context.position];

export type GroupNodeRendererEvents =
  | { type: "START_ITERATION" }
  | { type: "GO_BACK" }
  | { type: "LEAVE_ITERATION" }
  | { type: "GO_FORWARD" }
  | { type: "EDIT_ITERATION"; position: number }
  | { type: "FINISH_ITERATION"; context: TModuleVariableValue };

export const createGroupNodeRendererMachine = (
  initialContext: GroupNodeRendererContext
) =>
  /** @xstate-layout N4IgpgJg5mDOIC5RQE4HsCuAHAcmiYASmAHYEpgoB0AlhADZgDEAygCoCChbA+gJJsAooQ5s+AeRwBtAAwBdRKCxpYNAC400JRSAAeiAIwBmAwBoQAT0MB2a1QCs1gBwGATPYC+X8yXxwdqJi4fsRklJQ6yqoaWjr6CAC0AGzmVgiurlRO1q5GAJz2TkbFJQAsRt4ggdh4BKHklLQMYJEq6praSHqIpa6phgYyVEY5+YUlZZXVwXWkDdQoGCQkNCRQrdEdcYjFQy7u-QgGblmjBUUTRqVeXkA */
  createMachine(
    {
      predictableActionArguments: true,
      id: "groupNodeRenderer",
      initial: "idle",
      tsTypes: {} as import("./groupNodeRenderer.machine.typegen").Typegen0,
      schema: {
        context: {} as GroupNodeRendererContext,
        events: {} as GroupNodeRendererEvents,
      },
      context: initialContext ?? {
        iterations: [],
        position: 0,
      },
      states: {
        idle: {
          on: {
            START_ITERATION: {
              target: "running",
              actions: "addEmptyIteration",
            },
            GO_BACK: {
              actions: "goBack",
              cond: "canGoBack",
            },
            GO_FORWARD: {
              cond: "canGoFroward",
              actions: "goForward",
            },
            EDIT_ITERATION: {
              actions: "assignIterationPosition",
              target: "running",
            },
          },
        },
        running: {
          on: {
            LEAVE_ITERATION: {
              target: "idle",
              actions: "removeUnfinishedIteration",
            },
            FINISH_ITERATION: {
              target: "idle",
              actions: "addIterationResult",
            },
          },
        },
      },
    },
    {
      actions: {
        addIterationResult: assign({
          iterations: (context, event) => {
            const newIterations = context.iterations;
            context.iterations[0] = event.context;
            return newIterations;
          },
        }),
        addEmptyIteration: assign({
          iterations: (context, _event) => [
            { history: { nodes: [], position: 0 }, variables: {} },
            ...context.iterations,
          ],
        }),
        removeUnfinishedIteration: assign({
          iterations: (context, _event) => {
            const newIterations = context.iterations;
            newIterations.shift();
            return newIterations;
          },
        }),
        assignIterationPosition: assign({
          position: (_, event) => event.position,
        }),
        goBack: assign({
          position: (context) => context.position - 1,
        }),
        goForward: assign({
          position: (context) => context.position + 1,
        }),
      },
      guards: {
        canGoBack: (context) =>
          canGoBackInArray(context.iterations, context.position),
        canGoFroward: (context) =>
          canGoForwardInArray(context.iterations, context.position),
      },
    }
  );
