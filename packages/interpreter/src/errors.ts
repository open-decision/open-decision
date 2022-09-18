import {
  InterpreterError,
  ODValidationError,
  ODValidationErrorConstructorParameters,
} from "@open-decision/type-classes";

export class InvalidTreeError extends ODValidationError {
  constructor(zodError: ODValidationErrorConstructorParameters["zodError"]) {
    super({
      message: `The provided tree is not in the correct format`,
      code: "INVALID_TREE",
      zodError,
    });
  }
}

export class MissingEdgeForThruthyConditionError extends InterpreterError {
  constructor() {
    super({
      message: "There is no Edge for this condition.",
      code: "NO_EDGE_FOR_THRUTHY_CONDITION",
    });
  }
}

export class NoTruthyConditionError extends InterpreterError {
  constructor() {
    super({
      message: "No thruthy condition has been found.",
      code: "NO_TRUTHY_CONDITION",
    });
  }
}
