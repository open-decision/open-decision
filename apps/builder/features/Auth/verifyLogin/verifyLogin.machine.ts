import { safeFetch } from "@open-decision/api-helpers";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { assign, createMachine } from "xstate";

type Events =
  | { type: "VERIFY_LOGIN"; password: string }
  | { type: "SUCCESSFULL_VERIFY_LOGIN" }
  | { type: "FAILED_VERIFY_LOGIN"; error: APIError };

type Context = { Error?: APIError };

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
        verifyLogin: (_, event) => async (send) => {
          const { password } = event;

          await safeFetch("/api/external-api/auth/verifyLogin", {
            body: { email, password },
            method: "POST",
          })
            .then(() => send("SUCCESSFULL_VERIFY_LOGIN"))
            .catch((error) =>
              isAPIError(error)
                ? send({
                    type: "FAILED_VERIFY_LOGIN",
                    error: new APIError({
                      ...error,
                      message: "Incorrect Password",
                    }),
                  })
                : send({
                    type: "FAILED_VERIFY_LOGIN",
                    error: new APIError({
                      code: "UNEXPECTED_ERROR",
                      message:
                        "Ein Fehler ist aufgetreten. Bitte versuce es erneut.",
                    }),
                  })
            );
        },
      },
    }
  );
