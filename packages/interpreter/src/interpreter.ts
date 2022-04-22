import {
  Tree,
  ODError,
  ODValidationErrorConstructorParameters,
  ODValidationError,
} from "@open-decision/type-classes";
import { splitAt } from "remeda";
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

export function createInterpreter(json: Tree.TTree) {
  const decodedJSON = Tree.Type.safeParse(json);

  if (!decodedJSON.success) return new InvalidTreeError(decodedJSON.error);
  if (!decodedJSON.data.startNode) return new MissingStartNodeError();

  return createInterpreterMachine(
    decodedJSON.data as Required<Tree.TTree, "startNode">
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
  (context: InterpreterContext, event: ResolveEvents) =>
  (callback: Sender<ResolverEvents>) => {
    const conditions = Tree.getConditions(context.tree)(event.conditionIds);

    for (const conditionId in conditions) {
      const condition = conditions[conditionId];
      const existingAnswerId = context.history.answers[condition.inputId];

      if (condition.answerId === existingAnswerId) {
        const edge = Object.values(context.tree.edges ?? {}).find(
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
  history: { nodes: string[]; answers: Record<string, string> };
  currentNodeId: string;
  hasHistory: boolean;
  tree: Required<Tree.TTree, "startNode">;
  Error?: MissingEdgeForThruthyCondition | NoTruthyCondition;
};

type Events =
  | { type: "ADD_USER_ANSWER"; inputId: string; answerId: string }
  | { type: "EVALUATE_NODE_CONDITIONS"; conditionIds: string[] }
  | { type: "RESET" }
  | { type: "GO_BACK" }
  | ResolverEvents
  | ResolveEvents;

export type InterpreterService = Interpreter<
  InterpreterContext,
  any,
  Events,
  any,
  any
>;

export const createInterpreterMachine = (
  tree: Required<Tree.TTree, "startNode">
) =>
  createMachine(
    {
      tsTypes: {} as import("./interpreter.typegen").Typegen0,
      schema: {
        context: {} as InterpreterContext,
        events: {} as Events,
      },
      context: {
        history: { nodes: [], answers: {} },
        currentNodeId: tree.startNode,
        hasHistory: false,
        tree,
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
              cond: "hasHistory",
              actions: "goBack",
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
        error: {},
      },
    },
    {
      actions: {
        assignAnswerToContext: assign((context, event) => ({
          history: {
            nodes: [...context.history.nodes, context.currentNodeId],
            answers: { [event.inputId]: event.answerId },
          },
          hasHistory: true,
        })),
        resetToInitialContext: assign((context) => ({
          currentNodeId: context.tree.startNode,
          history: { nodes: [], answers: {} },
          hasHistory: false,
        })),
        goBack: assign((context) => {
          const [newNodes, [previousNode]] = splitAt(context.history.nodes, -1);

          return {
            currentNodeId: previousNode,
            hasHistory: newNodes.length > 0,
            history: { nodes: newNodes, answers: context.history.answers },
          };
        }),
        assignErrorToContext: assign({
          Error: (_context, event) => event.Error,
        }),
        assignNewTarget: assign({
          currentNodeId: (_context, event) => event.target,
        }),
      },
      services: {
        resolveConditions,
      },
      guards: {
        hasHistory: (context) => context.hasHistory,
      },
    }
  );
