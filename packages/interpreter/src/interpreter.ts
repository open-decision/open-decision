import { Tree } from "@open-decision/type-classes";
import { assign, createMachine, Interpreter, Sender } from "xstate";
import {
  InvalidTreeError,
  MissingEdgeForThruthyConditionException,
  NoTruthyConditionException,
} from "./errors";
import { canGoBack, canGoForward } from "./methods";
import { createTreeClient, TTreeClient } from "@open-decision/tree-client";

export function createInterpreter(
  json: Tree.TTree,
  initialNode?: string,
  interpreterOptions?: InterpreterOptions
) {
  const decodedJSON = Tree.Type.safeParse(json);

  if (!decodedJSON.success) return new InvalidTreeError(decodedJSON.error);

  const treeClient = createTreeClient(decodedJSON.data);

  return createInterpreterMachine(
    treeClient,
    initialNode ?? decodedJSON.data.startNode,
    interpreterOptions
  );
}

type ResolveEvents = {
  type: "EVALUATE_NODE_CONDITIONS";
  conditionIds: string[];
};

type ResolverEvents =
  | { type: "VALID_INTERPRETATION"; target: string }
  | { type: "INVALID_INTERPRETATION"; error: InterpreterErrors };

const resolveConditions =
  (treeClient: TTreeClient) =>
  (context: InterpreterContext, event: ResolveEvents) =>
  (callback: Sender<ResolverEvents>) => {
    const conditions = treeClient.conditions.get.collection(event.conditionIds);

    for (const conditionId in conditions) {
      const condition = conditions[conditionId];
      // FIXME conditions have not yet implemented resolvers
      return;

      // const existingAnswerId = context.answers[condition.inputId];

      // if (condition.answerId === existingAnswerId) {
      //   const edge = Object.values<Edge.TEdge>(tree.edges ?? {}).find(
      //     (edge) => edge.conditionId === condition.id
      //   );

      //   if (!edge)
      //     return callback({
      //       type: "INVALID_INTERPRETATION",
      //       error: new MissingEdgeForThruthyConditionException(),
      //     });

      //   return callback({
      //     type: "VALID_INTERPRETATION",
      //     target: edge.target,
      //   });
      // }
    }
    callback({
      type: "INVALID_INTERPRETATION",
      error: new NoTruthyConditionException(),
    });
  };

export type InterpreterErrors =
  | MissingEdgeForThruthyConditionException
  | NoTruthyConditionException;

export type InterpreterContext = {
  history: { nodes: string[]; position: number };
  answers: Record<string, string>;
};

export type InterpreterEvents =
  | { type: "ADD_USER_ANSWER"; inputId: string; answerId: string }
  | { type: "EVALUATE_NODE_CONDITIONS"; conditionIds: string[] }
  | { type: "RESET" }
  | { type: "GO_BACK" }
  | { type: "GO_FORWARD" }
  | { type: "RECOVER" }
  | ResolverEvents
  | ResolveEvents;

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
};

export const createInterpreterMachine = (
  treeClient: TTreeClient,
  initialNode: string,
  { onError, onSelectedNodeChange }: InterpreterOptions = {}
) => {
  return createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import("./interpreter.typegen").Typegen0,
      schema: {
        context: {} as InterpreterContext,
        events: {} as InterpreterEvents,
      },
      context: {
        history: { nodes: [initialNode], position: 0 },
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
            [event.inputId]: event.answerId,
          }),
        }),
        resetToInitialContext: assign((_context, _event) => ({
          history: { nodes: [initialNode], position: 0 },
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
        resolveConditions: resolveConditions(treeClient),
      },
      guards: {
        canGoBack,
        canGoForward,
      },
    }
  );
};
