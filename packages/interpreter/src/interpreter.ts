import {
  Tree,
  ODError,
  ODValidationErrorConstructorParameters,
  ODValidationError,
} from "@open-decision/type-classes";
import { Required } from "utility-types";
import { assign, createMachine, Interpreter, Sender } from "xstate";

export class MissingStartNodeError extends ODError {
  constructor() {
    super({
      message: "The provided tree does not have a startNode",
      code: "INTERPRETER_MISSING_STARTNODE",
    });
  }
}

export class InvalidTreeError extends ODValidationError {
  constructor(zodError: ODValidationErrorConstructorParameters["zodError"]) {
    super({
      message: `The provided tree is not in the correct format`,
      code: "INTERPRETER_INVALID_TREE",
      zodError,
    });
  }
}

export class MissingEdgeForThruthyCondition extends ODError {
  constructor() {
    super({
      message: "There is no Edge for this condition.",
      code: "INTERPRETER_NO_EDGE_FOR_THRUTHY_CONDITION",
    });
  }
}

export class NoTruthyCondition extends ODError {
  constructor() {
    super({
      message: "No thruthy condition has been found.",
      code: "INTERPRETER_NO_TRUTHY_CONDITION",
    });
  }
}

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
  | { type: "INVALID_INTERPRETATION"; Error: ODError };

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
            Error: new MissingEdgeForThruthyCondition(),
          });

        return callback({
          type: "VALID_INTERPRETATION",
          target: edge.target,
        });
      }
    }
    callback({
      type: "INVALID_INTERPRETATION",
      Error: new NoTruthyCondition(),
    });
  };

export type InterpreterContext = {
  history: { nodes: string[]; position: number };
  answers: Record<string, string>;
  Error?: MissingEdgeForThruthyCondition | NoTruthyCondition;
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

export type InterpreterOptions = { isDebugMode?: boolean };

export const createInterpreterMachine = (
  tree: Required<Tree.TTree, "startNode">,
  { isDebugMode = false }: InterpreterOptions = {}
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
        Error: undefined,
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
              target: "error",
              actions: "assignErrorToContext",
            },
          },
        },
        error: {
          on: {
            RECOVER: {
              cond: "isDebugMode",
              target: "idle",
              actions: ["clearErrorFromContext", "goBack"],
            },
          },
        },
      },
    },
    {
      actions: {
        assignAnswerToContext: assign((_context, event) => ({
          answers: { [event.inputId]: event.answerId },
        })),
        resetToInitialContext: assign((_context, _event) => ({
          history: { nodes: [tree.startNode], position: 0 },
          answers: {},
          Error: undefined,
        })),
        goBack: assign((context) => ({
          history: {
            position:
              context.history.position + 1 > context.history.nodes.length
                ? context.history.nodes.length
                : context.history.position + 1,
            nodes: context.history.nodes,
          },
        })),
        goForward: assign((context) => ({
          history: {
            position:
              context.history.position - 1 < 0
                ? 0
                : context.history.position - 1,
            nodes: context.history.nodes,
          },
        })),
        assignErrorToContext: assign({
          Error: (_context, event) => event.Error,
        }),
        clearErrorFromContext: assign((_context, _event) => ({
          Error: undefined,
        })),
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
        canGoBack: (context) => context.history.nodes.length > 1,
        canGoForward: (context) => context.history.position > 0,
        isDebugMode: () => isDebugMode,
      },
    }
  );
