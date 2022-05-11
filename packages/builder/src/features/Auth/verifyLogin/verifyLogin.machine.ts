import { assign, createMachine } from "xstate";
import { VerificationFailedError } from "../errors/AuthErrors";
import { login } from "../utils/login";

type Errors = VerificationFailedError;

type Events =
  | { type: "VERIFY_LOGIN"; password: string }
  | { type: "SUCCESSFULL_VERIFY_LOGIN" }
  | { type: "FAILED_VERIFY_LOGIN"; error: Errors };

type Context = { Error?: Errors };

export type onVerify = () => void;
export type onVerifyFailure = () => void;

export const createVerifyLoginMachine = (
  email: string,
  onVerify: onVerify,
  onVerifyFailure?: onVerifyFailure
) =>
  createMachine(
    {
      tsTypes: {} as import("./verifyLogin.machine.typegen").Typegen0,
      initial: "unverified",
      schema: {
        events: {} as Events,
        context: {} as Context,
      },
      on: {
        VERIFY_LOGIN: ".verifingLogin",
      },
      states: {
        unverified: {},
        verifingLogin: {
          invoke: {
            src: "verifyLogin",
          },
          on: {
            SUCCESSFULL_VERIFY_LOGIN: {
              target: "verified",
            },
            FAILED_VERIFY_LOGIN: {
              target: "verification_failed",
              actions: ["assignErrorToContext"],
            },
          },
        },
        verified: { type: "final", entry: () => onVerify() },
        verification_failed: { entry: () => onVerifyFailure?.() },
      },
    },
    {
      actions: {
        assignErrorToContext: assign((_context, event) => ({
          Error: event.error,
        })),
      },
      services: {
        verifyLogin: (_context, event) => async (send) => {
          if (event.type !== "VERIFY_LOGIN" || !email) return;

          const { password } = event;

          await login(
            email,
            password,
            () => send("SUCCESSFULL_VERIFY_LOGIN"),
            (error) =>
              send({
                type: "FAILED_VERIFY_LOGIN",
                error: new VerificationFailedError(error),
              })
          );
        },
      },
    }
  );
