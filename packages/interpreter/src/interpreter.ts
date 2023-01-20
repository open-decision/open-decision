import { Tree } from "@open-decision/tree-type";
import { assign, createMachine, Interpreter, Sender, State } from "xstate";
import { InvalidTreeError } from "./errors";
import { z } from "zod";
import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import {
  IVariable,
  TModuleVariableHistory,
  TModuleVariableValue,
} from "@open-decision/variables";
import { canGoBackInArray, canGoForwardInArray } from "@open-decision/utils";
import { TNodeId } from "@open-decision/tree-ids";

export type Resolver = (
  context: TModuleVariableValue,
  event: EVALUATE_NODE_CONDITIONS
) => (callback: Sender<ResolverEvents>) => void;

export type EVALUATE_NODE_CONDITIONS = {
  type: "EVALUATE_NODE_CONDITIONS";
  history?: TModuleVariableHistory;
};

type ResolverEvents =
  | {
      type: "VALID_INTERPRETATION";
      target: TNodeId;
      history?: TModuleVariableHistory;
    }
  | { type: "INVALID_INTERPRETATION"; error: ODProgrammerError | ODError }
  | { type: "FINAL_INTERPRETATION" };

export type InterpreterEvents =
  | { type: "ADD_USER_ANSWER"; variable: IVariable }
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
  TModuleVariableValue,
  any,
  InterpreterEvents,
  any,
  any
>;

export type InterpreterOptions = {
  onError?: (error: ODProgrammerError | ODError) => void;
  onSelectedNodeChange?: (
    nextNodeId: TModuleVariableHistory[number]["id"]
  ) => void;
  initialNode?: TNodeId;
  onDone?: (context: TModuleVariableValue) => void;
  onLeave?: () => void;
  environment: "private" | "shared" | "published";
  isInteractive?: boolean;
  initialContext?: Partial<TModuleVariableValue>;
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
    onLeave,
    isInteractive,
    initialContext = {} as TModuleVariableValue,
  }: InterpreterOptions = {
    environment: "private",
    initialContext: {} as TModuleVariableValue,
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
        context: {} as TModuleVariableValue,
        events: {} as InterpreterEvents,
      },
      context: {
        history: {
          nodes: [{ id: startNode }, ...(initialContext.history?.nodes ?? [])],
          position: initialContext.history?.position ?? 0,
        },
        variables: initialContext.variables ?? {},
      } as TModuleVariableValue,
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
            GO_BACK: [
              {
                cond: "canGoBack",
                actions: "goBack",
              },
              { cond: "canLeave", actions: "onLeave" },
            ],
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
          history: { nodes: [{ id: startNode }], position: 0 },
          variables: {},
          Error: undefined,
        })),
        goBack: assign((context) => {
          // When there is no history we should not go back.
          if (context.history.nodes.length === 0) {
            return context;
          }

          // When we have reached the end of the history array we should not go back further.
          if (context.history.position === context.history.nodes.length - 1) {
            return context;
          }

          onSelectedNodeChange?.(
            context.history.nodes[context.history.position + 1].id
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
            context.history.nodes[context.history.position - 1].id
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
              nodes: [{ id: event.target }, ...context.history.nodes],
            },
          };
        }),
        callOnError: (_context, event) => onError?.(event.error),
        assignNewTarget: assign((context, event) => {
          onSelectedNodeChange?.(event.target);

          // Split the existing history by the current position. This enables the user to
          // go back and change an answer and go into a new direction.
          const previousHistory =
            context.history.position !== 0
              ? context.history.nodes.slice(
                  context.history.position,
                  context.history.nodes.length
                )
              : context.history.nodes;

          if (event.history) {
            previousHistory[0].subHistory = event.history;
          }

          const history = [
            // Add the target node to the history stack at the front
            { id: event.target },
            ...previousHistory,
          ];

          return {
            history: {
              position:
                context.history.position !== 0 ? 0 : context.history.position,
              nodes: history,
            },
          };
        }),
        onLeave,
      },
      services: {
        resolveConditions: resolver,
      },
      guards: {
        canGoBack: (context) =>
          canGoBackInArray(context.history.nodes, context.history.position),
        canGoForward: (context) =>
          canGoForwardInArray(context.history.nodes, context.history.position),
        isInteractive: () => isInteractive ?? true,
        canLeave: () => !!onLeave,
      },
    }
  );
};

export type InterpreterMachine = ReturnType<typeof createInterpreterMachine>;
export type InterpreterState = State<
  TModuleVariableValue,
  InterpreterEvents,
  any,
  any,
  any
>;
