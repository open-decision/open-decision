import {
  InterpreterError,
  InterpreterException,
  ODValidationError,
  ODValidationErrorConstructorParameters,
} from "@open-decision/type-classes";

export class MissingStartNodeError extends InterpreterError {
  constructor() {
    super({
      message: "The provided tree does not have a startNode",
      code: "MISSING_STARTNODE",
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

export class MissingEdgeForThruthyConditionException extends InterpreterException {
  constructor() {
    super({
      message: "There is no Edge for this condition.",
      code: "NO_EDGE_FOR_THRUTHY_CONDITION",
    });
  }
}

export class NoTruthyConditionException extends InterpreterException {
  constructor() {
    super({
      message: "No thruthy condition has been found.",
      code: "NO_TRUTHY_CONDITION",
    });
  }
}

export class NoCurrentNodeError extends InterpreterError {
  constructor() {
    super({
      code: "NO_CURRENT_NODE",
      message: "The current Node could not be retrieved.",
    });
  }
}
