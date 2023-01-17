import { IVariablePlugin, TNodeId, Tree } from "@open-decision/tree-type";
import { assign, createMachine, Interpreter, Sender } from "xstate";
import { InvalidTreeError } from "./errors";
import { canGoBack, canGoForward } from "./methods";
import { z } from "zod";
import { ODError, ODProgrammerError } from "@open-decision/type-classes";

export type Resolver = (
  context: InterpreterContext,
  event: EVALUATE_NODE_CONDITIONS
) => (callback: Sender<ResolverEvents>) => void;

export type EVALUATE_NODE_CONDITIONS = {
  type: "EVALUATE_NODE_CONDITIONS";
};

type ResolverEvents =
  | { type: "VALID_INTERPRETATION"; target: TNodeId }
  | { type: "INVALID_INTERPRETATION"; error: ODProgrammerError | ODError }
  | { type: "FINAL_INTERPRETATION" };

export type InterpreterContext = {
  history: { nodes: TNodeId[]; position: number };
  variables: Record<string, IVariablePlugin>;
};

export type InterpreterEvents =
  | { type: "ADD_USER_ANSWER"; variable: IVariablePlugin }
  | { type: "RESET" }
  | { type: "DONE" }
  | { type: "GO_BACK" }
  | { type: "GO_FORWARD" }
  | { type: "JUMP_TO_NODE"; target: TNodeId }
  | { type: "RECOVER" }
  | { type: "RESTART" }
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
  onError?: (error: ODProgrammerError | ODError) => void;
  onSelectedNodeChange?: (nextNodeId: TNodeId) => void;
  initialNode?: TNodeId;
  onDone?: (context: InterpreterContext) => void;
  environment: "private" | "shared" | "published";
  isInteractive?: boolean;
};

export const createInterpreterMachine = (
  json: Tree.TTree,
  TreeType: z.ZodType<Tree.TTree>,
  resolver: Resolver,
  {
    onError,
    onSelectedNodeChange,
    initialNode,
    onDone,
    isInteractive,
  }: InterpreterOptions = {
    environment: "private",
  }
) => {
  const decodedJSON = TreeType.safeParse(json);

  if (!decodedJSON.success) {
    console.error(decodedJSON.error);
    return new InvalidTreeError(decodedJSON.error);
  }

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
        variables: {},
      } as InterpreterContext,
      id: "interpreter",
      initial: "idle",
      on: {
        RESET: {
          target: "#interpreter.idle",
          actions: "resetToInitialContext",
        },
        DONE: {
          target: "#interpreter.done",
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
              cond: "isInteractive",
            },
            GO_BACK: {
              cond: "canGoBack",
              actions: "goBack",
            },
            GO_FORWARD: {
              cond: "canGoForward",
              actions: "goForward",
            },
            JUMP_TO_NODE: {
              actions: "jumpToNode",
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
            FINAL_INTERPRETATION: {
              target: "done",
            },
          },
        },
        done: {
          entry: onDone,
          on: {
            RESTART: {
              target: "idle",
              actions: "resetToInitialContext",
            },
          },
        },
      },
    },
    {
      actions: {
        assignAnswerToContext: assign({
          variables: (context, event) => {
            return {
              ...context.variables,
              [event.variable.escapedName]: event.variable,
            };
          },
        }),
        resetToInitialContext: assign((_context, _event) => ({
          history: { nodes: [startNode], position: 0 },
          variables: {},
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
        jumpToNode: assign((context, event) => {
          onSelectedNodeChange?.(event.target);

          return {
            history: {
              position: 0,
              nodes: [event.target, ...context.history.nodes],
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
        resolveConditions: resolver,
      },
      guards: {
        canGoBack,
        canGoForward,
        isInteractive: () => isInteractive ?? true,
      },
    }
  );
};
