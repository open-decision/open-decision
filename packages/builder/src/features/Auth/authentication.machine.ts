import { NextRouter } from "next/router";
import { protectedRoutes } from "src/config/protectedRoutes";
import { assign, createMachine, Interpreter, Sender } from "xstate";
import { login } from "./utils/login";
import { logout } from "./utils/logout";
import { refresh } from "./utils/refresh";
import { register } from "./utils/register";
import { resetPassword } from "./utils/resetPassword";
import { LoginResponse } from "./utils/shared";

type LocationContext = { location?: string };

type ErrorContext = { error?: string | undefined };

type EmptyContext = {
  user: undefined;
} & LocationContext &
  ErrorContext;

type DefinedContext = {
  user: LoginResponse;
} & LocationContext &
  ErrorContext;

export type Context = EmptyContext | DefinedContext;

type State =
  | {
      value: "undetermined";
      context: EmptyContext;
    }
  | {
      value: "loggedIn";
      context: DefinedContext;
    }
  | {
      value: "loggedOut";
      context: EmptyContext;
    };

export type Events =
  | { type: "REPORT_IS_LOGGED_IN"; user: LoginResponse }
  | { type: "REPORT_IS_LOGGED_OUT" }
  | { type: "LOG_OUT" }
  | { type: "LOG_IN"; email: string; password: string }
  | { type: "SUCCESSFULL_LOGIN"; user: LoginResponse }
  | { type: "FAILED_LOGIN"; error: any }
  | { type: "SAFE_USER"; user: LoginResponse }
  | { type: "REGISTER"; email: string; password: string }
  | { type: "SUCCESSFULL_REGISTER"; user: LoginResponse }
  | { type: "FAILED_REGISTER"; error: any }
  | { type: "SUCCESSFULL_REDIRECT" }
  | { type: "SUCCESSFULL_LOGOUT" }
  | { type: "FAILED_LOGOUT" }
  | { type: "RESET_PASSWORD"; email: string }
  | { type: "SUCCESSFULL_RESET" }
  | { type: "FAILED_RESET"; error: any };

export type AuthService = Interpreter<Context, any, Events, State>;

export const createAuthenticationMachine = (router: NextRouter) =>
  createMachine<Context, Events, State>(
    {
      id: "authentication",
      initial: "undetermined",
      context: {
        user: undefined,
        location: undefined,
        error: undefined,
      },
      states: {
        undetermined: {
          invoke: {
            src: "checkIfLoggedIn",
            onError: {
              target: "loggedOut",
            },
          },
          on: {
            REPORT_IS_LOGGED_IN: {
              target: "loggedIn",
              actions: "assignUserToContext",
            },
            REPORT_IS_LOGGED_OUT: {
              target: "loggedOut",
              actions: "assignLocationToContext",
            },
          },
        },
        loggedIn: {
          initial: "redirectToLocation",
          states: {
            idle: {
              after: {
                30000: {
                  target: "refresh",
                },
              },
            },
            redirectToLocation: {
              invoke: { src: "redirectToLocation", onDone: { target: "idle" } },
            },
            refresh: {
              invoke: {
                src: "checkIfLoggedIn",
                onError: {
                  target: "#authentication.loggedOut",
                },
              },
              on: {
                REPORT_IS_LOGGED_IN: {
                  target: "#authentication.loggedIn",
                  actions: "assignUserToContext",
                },
                REPORT_IS_LOGGED_OUT: "#authentication.loggedOut",
              },
            },
            loggingOut: {
              invoke: {
                src: "logout",
                onDone: {
                  target: "#authentication.loggedOut",
                },
              },
            },
          },
          on: {
            LOG_OUT: {
              target: ".loggingOut",
            },
          },
        },
        loggedOut: {
          entry: "clearUserDetailsFromContext",
          initial: "redirectToLogin",
          on: {
            LOG_IN: {
              target: ".loggingIn",
            },
            REGISTER: {
              target: ".register",
            },
            RESET_PASSWORD: {
              target: ".resetPassword",
            },
          },
          states: {
            idle: {},
            resetPassword: {
              invoke: {
                src: "resetPassword",
              },
              on: {
                SUCCESSFULL_RESET: {
                  target: "#authentication.loggedOut",
                },
                FAILED_RESET: {
                  target: "#authentication.loggedOut",
                  actions: "assignErrorToContext",
                },
              },
            },
            loggingIn: {
              invoke: {
                src: "login",
              },
              on: {
                SUCCESSFULL_LOGIN: {
                  target: "#authentication.loggedIn",
                  actions: ["assignUserToContext", "removeErrorFromContext"],
                },
                FAILED_LOGIN: {
                  target: "#authentication.loggedOut",
                  actions: [
                    "clearUserDetailsFromContext",
                    "assignErrorToContext",
                  ],
                },
              },
            },
            redirectToLogin: {
              invoke: { src: "redirectToLogin" },
            },
            register: {
              invoke: {
                src: "register",
              },
              on: {
                SUCCESSFULL_REGISTER: {
                  target: "#authentication.loggedIn",
                  actions: "assignUserToContext",
                },
                FAILED_REGISTER: {
                  target: "#authentication.loggedOut",
                  actions: [
                    "clearUserDetailsFromContext",
                    "assignErrorToContext",
                  ],
                },
              },
            },
          },
        },
      },
    },
    {
      services: {
        checkIfLoggedIn: () => async (send: Sender<Events>) => {
          await refresh(
            (user) =>
              send({
                type: "REPORT_IS_LOGGED_IN",
                user,
              }),
            (error) => {
              console.log(error);
              return send({ type: "REPORT_IS_LOGGED_OUT" });
            }
          );
        },
        login: (_context, event) => async (send: Sender<Events>) => {
          if (event.type !== "LOG_IN") return;
          const { email, password } = event;

          await login(
            email,
            password,
            (data) =>
              send({
                type: "SUCCESSFULL_LOGIN",
                user: data,
              }),
            (error) => send({ type: "FAILED_LOGIN", error })
          );
        },
        register: (_context, event) => async (send: Sender<Events>) => {
          if (event.type !== "REGISTER") return;

          const { email, password } = event;

          await register(
            email,
            password,
            (user) =>
              send({
                type: "SUCCESSFULL_REGISTER",
                user,
              }),
            (error) => send({ type: "FAILED_REGISTER", error })
          );
        },
        logout: (_context, event) => async (send: Sender<Events>) => {
          if (event.type !== "LOG_OUT") return;

          await logout(
            () => send({ type: "SUCCESSFULL_LOGOUT" }),
            () => send({ type: "FAILED_LOGOUT" })
          );
        },
        resetPassword: (_context, event) => async (send: Sender<Events>) => {
          if (event.type !== "RESET_PASSWORD") return;

          await resetPassword(
            event.email,
            () => send("SUCCESSFULL_RESET"),
            (error) => send({ type: "FAILED_RESET", error })
          );
        },
        redirectToLogin:
          (_context, _event) => async (_send: Sender<Events>) => {
            protectedRoutes.includes(router.pathname)
              ? router.push("/login")
              : null;
          },
        redirectToLocation: (context) => async () => {
          router.push(context?.location ?? "/");
        },
      },
      actions: {
        assignUserToContext: assign((context, event) => {
          if (
            event.type !== "REPORT_IS_LOGGED_IN" &&
            event.type !== "SUCCESSFULL_LOGIN"
          ) {
            return context;
          }

          return {
            ...context,
            user: event.user,
          };
        }),
        clearUserDetailsFromContext: assign({
          user: (_context, _event) => undefined,
        }),
        assignLocationToContext: assign({
          location: (_context, _event) => {
            const isProtected = protectedRoutes.includes(router.pathname);

            return isProtected ? router.pathname : "/";
          },
        }),
        assignErrorToContext: assign({
          error: (_context, event) => {
            if (
              event.type !== "FAILED_LOGIN" &&
              event.type !== "FAILED_REGISTER" &&
              event.type !== "FAILED_RESET"
            )
              return;

            return event.error;
          },
        }),
        removeErrorFromContext: assign({
          error: (_context, _event) => undefined,
        }),
      },
    }
  );
