import { Tree } from "@open-decision/type-classes";
import { Required } from "utility-types";
import { assign, createMachine, Interpreter, Sender } from "xstate";
import {
  InvalidTreeError,
  MissingStartNodeError,
  MissingEdgeForThruthyConditionException,
  NoTruthyConditionException,
} from "./errors";
import { canGoBack, canGoForward } from "./methods";

export function createInterpreter(
  json: Tree.TTree,
  interpreterOptions?: InterpreterOptions
) {
  const decodedJSON = Tree.Type.safeParse(json);

  if (!decodedJSON.success) return new InvalidTreeError(decodedJSON.error);
  if (!decodedJSON.data.startNode) return new MissingStartNodeError();

  return createInterpreterMachine(
    decodedJSON.data as Required<Tree.TTree, "startNode">,
    interpreterOptions
  );
}

type ResolveEvents = {
  type: "EVALUATE_NODE_CONDITIONS";
  conditionIds: string[];
};

type ResolverEvents =
  | { type: "VALID_INTERPRETATION"; target: string }
  | { type: "INVALID_INTERPRETATION"; exception: InterpreterExceptions };

const resolveConditions =
  (tree: Tree.TTree) =>
  (context: InterpreterContext, event: ResolveEvents) =>
  (callback: Sender<ResolverEvents>) => {
    const conditions = Tree.getConditions(tree)(event.conditionIds);

    for (const conditionId in conditions) {
      const condition = conditions[conditionId];
      const existingAnswerId = context.answers[condition.inputId];

      if (condition.answerId === existingAnswerId) {
        const edge = Object.values(tree.edges ?? {}).find(
          (edge) => edge.conditionId === condition.id
        );

        if (!edge)
          return callback({
            type: "INVALID_INTERPRETATION",
            exception: new MissingEdgeForThruthyConditionException(),
          });

        return callback({
          type: "VALID_INTERPRETATION",
          target: edge.target,
        });
      }
    }
    callback({
      type: "INVALID_INTERPRETATION",
      exception: new NoTruthyConditionException(),
    });
  };

export type InterpreterExceptions =
  | MissingEdgeForThruthyConditionException
  | NoTruthyConditionException;

export type InterpreterContext = {
  history: { nodes: string[]; position: number };
  answers: Record<string, string>;
};

type Events =
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
  Events,
  any,
  any
>;

export type InterpreterOptions = {
  onException?: (exception: InterpreterExceptions) => void;
};

export const createInterpreterMachine = (
  tree: Required<Tree.TTree, "startNode">,
  { onException }: InterpreterOptions = {}
) =>
  createMachine(
    {
      tsTypes: {} as import("./interpreter.typegen").Typegen0,
      schema: {
        context: {} as InterpreterContext,
        events: {} as Events,
      },
      context: {
        history: { nodes: [tree.startNode], position: 0 },
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
              actions: "callOnException",
            },
          },
        },
      },
    },
    {
      actions: {
        assignAnswerToContext: assign((context, event) => ({
          answers: { ...context.answers, [event.inputId]: event.answerId },
        })),
        resetToInitialContext: assign((_context, _event) => ({
          history: { nodes: [tree.startNode], position: 0 },
          answers: {},
          Error: undefined,
        })),
        goBack: assign((context) => {
          // When there is no history we should not go back.
          if (context.history.nodes.length === 0) return context;
          // When we have reached the end of the history array we should not go back further.
          if (context.history.position === context.history.nodes.length - 1)
            return context;

          return {
            history: {
              position: context.history.position + 1,
              nodes: context.history.nodes,
            },
          };
        }),
        goForward: assign((context) => {
          if (context.history.position === 0) return context;

          return {
            history: {
              position: context.history.position - 1,
              nodes: context.history.nodes,
            },
          };
        }),
        callOnException: (_context, event) => onException?.(event.exception),
        assignNewTarget: assign((context, event) => ({
          history: {
            position: context.history.position,
            nodes: [event.target, ...context.history.nodes],
          },
        })),
      },
      services: {
        resolveConditions: resolveConditions(tree),
      },
      guards: {
        canGoBack,
        canGoForward,
      },
    }
  );
