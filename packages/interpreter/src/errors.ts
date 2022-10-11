import {
  InterpreterError,
  ODProgrammerError,
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

/**
 * This error is thrown when the interpreter is unable to find an edge for a condition that is truthy.
 */
export class MissingEdgeForThruthyConditionError extends InterpreterError {
  constructor() {
    super({
      message: "There is no Edge for this condition.",
      code: "NO_EDGE_FOR_THRUTHY_CONDITION",
    });
  }
}

/**
 * This error is thrown when the interpreter is unable to find an input for a condition.
 * Since the input answer is required to resolve a condition, this error is thrown when the inputId is missing.
 */
export class MissingInputForConditionError extends InterpreterError {
  constructor() {
    super({
      message: "There is no input for this condition.",
      code: "NO_INPUT_FOR_CONDITION",
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

export class MissingAnswerOnInterpreterContextError extends ODProgrammerError {
  constructor() {
    super({
      code: "MISSING_ANSWER_ON_INTERPRETER_CONTEXT",
      message:
        "No answer was found on the interpreter context for the provided condition.",
    });
  }
}
