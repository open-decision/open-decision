import { Tree } from "@open-decision/tree-sync";
import { assign, createMachine, Interpreter, Sender } from "xstate";
import {
  InvalidTreeError,
  MissingEdgeForThruthyConditionError,
  NoTruthyConditionError,
} from "./errors";
import { canGoBack, canGoForward } from "./methods";
import { z } from "zod";

export type Resolver = (
  tree: Tree.TTree
) => (
  context: InterpreterContext,
  event: EVALUATE_NODE_CONDITIONS
) => (callback: Sender<ResolverEvents>) => void;

export type EVALUATE_NODE_CONDITIONS = {
  type: "EVALUATE_NODE_CONDITIONS";
  conditionIds: string[];
  nodeId: string;
};

type ResolverEvents =
  | { type: "VALID_INTERPRETATION"; target: string }
  | { type: "INVALID_INTERPRETATION"; error: InterpreterErrors };

export type InterpreterErrors =
  | MissingEdgeForThruthyConditionError
  | NoTruthyConditionError;

export type InterpreterContext = {
  history: { nodes: string[]; position: number };
  answers: Record<string, string>;
};

export type InterpreterEvents =
  | { type: "ADD_USER_ANSWER"; inputId: string; answer: string }
  | { type: "RESET" }
  | { type: "GO_BACK" }
  | { type: "GO_FORWARD" }
  | { type: "RECOVER" }
  | ResolverEvents
  | EVALUATE_NODE_CONDITIONS;

export type InterpreterService = Interpreter<
  InterpreterContext,
  any,
  InterpreterEvents,
  any,
  any
>;

export type InterpreterOptions = {
  onError?: (error: InterpreterErrors) => void;
  onSelectedNodeChange?: (nextNodeIs: string) => void;
  initialNode?: string;
};

export const createInterpreterMachine = (
  json: Tree.TTree,
  TreeType: z.ZodType<Tree.TTree>,
  resolver: Resolver,
  { onError, onSelectedNodeChange, initialNode }: InterpreterOptions = {}
) => {
  const decodedJSON = TreeType.safeParse(json);

  if (!decodedJSON.success) return new InvalidTreeError(decodedJSON.error);

  const startNode = initialNode ?? decodedJSON.data.startNode;

  return createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import("./interpreter.typegen").Typegen0,
      schema: {
        context: {} as InterpreterContext,
        events: {} as InterpreterEvents,
      },
      context: {
        history: {
          nodes: [startNode],
          position: 0,
        },
        answers: {},
      },
      id: "interpreter",
      initial: "idle",
      on: {
        RESET: {
          target: "#interpreter.idle",
          actions: "resetToInitialContext",
        },
      },
      states: {
        idle: {
          on: {
            ADD_USER_ANSWER: {
              actions: "assignAnswerToContext",
            },
            EVALUATE_NODE_CONDITIONS: {
              target: "interpreting",
            },
            GO_BACK: {
              cond: "canGoBack",
              actions: "goBack",
            },
            GO_FORWARD: {
              cond: "canGoForward",
              actions: "goForward",
            },
          },
        },
        interpreting: {
          invoke: {
            id: "interpret_select_answer",
            src: "resolveConditions",
          },
          on: {
            VALID_INTERPRETATION: {
              target: "idle",
              actions: "assignNewTarget",
            },
            INVALID_INTERPRETATION: {
              target: "idle",
              actions: "callOnError",
            },
          },
        },
      },
    },
    {
      actions: {
        assignAnswerToContext: assign({
          answers: (context, event) => ({
            ...context.answers,
            [event.inputId]: event.answer,
          }),
        }),
        resetToInitialContext: assign((_context, _event) => ({
          history: { nodes: [startNode], position: 0 },
          answers: {},
          Error: undefined,
        })),
        goBack: assign((context) => {
          // When there is no history we should not go back.
          if (context.history.nodes.length === 0) return context;
          // When we have reached the end of the history array we should not go back further.
          if (context.history.position === context.history.nodes.length - 1)
            return context;

          onSelectedNodeChange?.(
            context.history.nodes[context.history.position + 1]
          );

          return {
            history: {
              position: context.history.position + 1,
              nodes: context.history.nodes,
            },
          };
        }),
        goForward: assign((context) => {
          if (context.history.position === 0) return context;
          onSelectedNodeChange?.(
            context.history.nodes[context.history.position - 1]
          );

          return {
            history: {
              position: context.history.position - 1,
              nodes: context.history.nodes,
            },
          };
        }),
        callOnError: (_context, event) => onError?.(event.error),
        assignNewTarget: assign((context, event) => {
          onSelectedNodeChange?.(event.target);

          if (context.history.position !== 0) {
            return {
              history: {
                position: 0,
                nodes: [
                  event.target,
                  ...context.history.nodes.slice(
                    context.history.position,
                    context.history.nodes.length
                  ),
                ],
              },
            };
          }

          return {
            history: {
              position: context.history.position,
              nodes: [event.target, ...context.history.nodes],
            },
          };
        }),
      },
      services: {
        resolveConditions: resolver(decodedJSON.data),
      },
      guards: {
        canGoBack,
        canGoForward,
      },
    }
  );
};
