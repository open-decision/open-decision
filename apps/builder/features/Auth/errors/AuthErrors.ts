import { ODError } from "@open-decision/type-classes";

export class VerificationFailedError extends ODError {
  constructor(message: string) {
    super({
      code: "AUTH_VALIDATION_FAILED",
      message,
    });
  }
}
