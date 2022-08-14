import {
  InterpreterError,
  ODError,
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
      code: "INVALID_TREE",
      zodError,
    });
  }
}

export class MissingEdgeForThruthyConditionException extends ODError {
  constructor() {
    super({
      message: "There is no Edge for this condition.",
      code: "NO_EDGE_FOR_THRUTHY_CONDITION",
    });
  }
}

export class NoTruthyConditionException extends ODError {
  constructor() {
    super({
      message: "No thruthy condition has been found.",
      code: "NO_TRUTHY_CONDITION",
    });
  }
}
