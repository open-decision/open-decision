import { websocketMachine } from "features/Data/websocket.machine";
import { NextRouter } from "next/router";
import { protectedRoutes } from "src/config/protectedRoutes";
import { assign, createMachine, Interpreter } from "xstate";
import { Doc } from "yjs";
import { refreshMachine } from "./refresh.machine";
import { login } from "./utils/login";
import { logout } from "./utils/logout";
import { refresh } from "./utils/refresh";
import { register } from "./utils/register";
import { requestPasswordReset } from "./utils/requestPasswordReset";
import { resetPassword } from "./utils/resetPassword";
import { LoginResponse } from "./utils/shared";

type SharedContext = {
  location?: string;
  error?: string;
  id?: string;
  yDoc?: Doc;
};

type EmptyContext = {
  auth: undefined;
} & SharedContext;

type DefinedContext = {
  auth: LoginResponse;
} & SharedContext;

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
  | { type: "FAILED_LOGIN"; error: string }
  | { type: "SAFE_USER"; user: LoginResponse }
  | { type: "REGISTER"; email: string; password: string }
  | { type: "SUCCESSFULL_REGISTER"; user: LoginResponse }
  | { type: "FAILED_REGISTER"; error: string }
  | { type: "SUCCESSFULL_REDIRECT" }
  | { type: "SUCCESSFULL_LOGOUT" }
  | { type: "FAILED_LOGOUT" }
  | { type: "REQUEST_PASSWORD_RESET"; email: string }
  | { type: "RESET_PASSWORD"; password: string; token: string }
  | { type: "SUCCESSFULL_PASSWORD_RESET" }
  | { type: "FAILED_PASSWORD_RESET"; error: string }
  | { type: "SUCCESSFULL_PASSWORD_RESET_REQUEST" }
  | { type: "FAILED_PASSWORD_RESET_REQUEST"; error: string }
  | { type: "REDIRECT" }
  | { type: "REFRESH" }
  | {
      type: "OPEN_WEBSOCKET";
      id: string;
      yDoc: Doc;
      onSync: () => void;
    }
  | { type: "WEBSOCKET_CONNECTION_FAILED" }
  | { type: "WEBSOCKET_CLOSED" }
  | { type: "CLOSE_WEBSOCKET" };

export type AuthService = Interpreter<Context, any, Events, State, any>;

export const createAuthenticationMachine = (router: NextRouter) =>
  createMachine<Context, Events, State>(
    {
      id: "authentication",
      initial: "undetermined",
      context: {
        auth: undefined,
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
            REPORT_IS_LOGGED_IN: [
              {
                target: "loggedIn",
                actions: ["assignUserToContext", "assignLocationToContext"],
              },
            ],
            REPORT_IS_LOGGED_OUT: [
              {
                target: "loggedOut.redirectToLogin",
                actions: "assignLocationToContext",
                cond: "isProtectedRoute",
              },
              { target: "loggedOut" },
            ],
          },
        },
        loggedIn: {
          type: "parallel",
          states: {
            authentication: {
              initial: "redirectToLocation",
              on: {
                LOG_OUT: ".loggingOut",
                REDIRECT: ".redirectToLocation",
              },
              states: {
                idle: {
                  on: {
                    REFRESH: "refresh",
                  },
                  invoke: {
                    id: "refreshMachine",
                    src: refreshMachine,
                    data: {
                      expires: (context: DefinedContext) =>
                        context.auth.access.expires,
                    },
                    onDone: "refresh",
                  },
                },
                redirectToLocation: {
                  invoke: {
                    src: "redirectToLocation",
                    onDone: { target: "idle" },
                  },
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
                      target: "idle",
                      actions: "assignUserToContext",
                    },
                    REPORT_IS_LOGGED_OUT: "#authentication.loggedOut",
                  },
                },
                loggingOut: {
                  invoke: {
                    src: "logout",
                    onDone: {
                      target: "#authentication.loggedOut.redirectToLogin",
                    },
                  },
                },
              },
            },
            websocket: {
              initial: "unconnected",
              states: {
                unconnected: {
                  on: {
                    OPEN_WEBSOCKET: { target: "connect" },
                    REPORT_IS_LOGGED_IN: {
                      target: "connect",
                    },
                    REPORT_IS_LOGGED_OUT: {
                      target: "unconnected",
                      actions: "clearWebsocketDataFromContext",
                    },
                  },
                },
                connect: {
                  invoke: {
                    id: "websocket",
                    src: websocketMachine,
                    data: {
                      token: (context) => context.auth.access.token,
                      id: (_context, event) => event.id,
                      yDoc: (_context, event) => event.yDoc,
                      onSync: (_context, event) => event.onSync,
                      retryLimit: 3,
                      retries: 0,
                    },
                  },
                  on: {
                    WEBSOCKET_CONNECTION_FAILED: "connect_failed",
                    WEBSOCKET_CLOSED: "unconnected",
                    CLOSE_WEBSOCKET: "unconnected",
                  },
                },
                connect_failed: {
                  type: "final",
                },
              },
            },
          },
        },
        loggedOut: {
          entry: "clearUserDetailsFromContext",
          initial: "idle",
          on: {
            LOG_IN: {
              target: ".loggingIn",
            },
            REGISTER: {
              target: ".register",
            },
            REQUEST_PASSWORD_RESET: {
              target: ".requestPasswordReset",
            },
            RESET_PASSWORD: {
              target: ".resetPassword",
            },
          },
          states: {
            idle: {},
            requestPasswordReset: {
              invoke: {
                src: "requestPasswordReset",
              },
              on: {
                SUCCESSFULL_PASSWORD_RESET_REQUEST: {
                  target: "#authentication.loggedOut.passwordResetRequested",
                },
                FAILED_PASSWORD_RESET_REQUEST: {
                  target: "#authentication.loggedOut",
                  actions: "assignErrorToContext",
                },
              },
            },
            passwordResetRequested: {
              type: "final",
            },
            resetPassword: {
              invoke: {
                src: "resetPassword",
              },
              on: {
                SUCCESSFULL_PASSWORD_RESET: {
                  target: "#authentication.loggedOut.redirectToLogin",
                },
                FAILED_PASSWORD_RESET: {
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
              invoke: { src: "redirectToLogin", onDone: { target: "idle" } },
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
        checkIfLoggedIn: () => async (send) => {
          await refresh(
            (user) =>
              send({
                type: "REPORT_IS_LOGGED_IN",
                user,
              }),
            () => send({ type: "REPORT_IS_LOGGED_OUT" })
          );
        },
        login: (_context, event) => async (send) => {
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
        register: (_context, event) => async (send) => {
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
        logout: (_context, event) => async (send) => {
          if (event.type !== "LOG_OUT") return;

          await logout(
            () => send({ type: "SUCCESSFULL_LOGOUT" }),
            () => send({ type: "FAILED_LOGOUT" })
          );
        },
        requestPasswordReset: (_context, event) => async (send) => {
          if (event.type !== "REQUEST_PASSWORD_RESET") return;

          await requestPasswordReset(
            event.email,
            () => send("SUCCESSFULL_PASSWORD_RESET_REQUEST"),
            (error) => send({ type: "FAILED_PASSWORD_RESET_REQUEST", error })
          );
        },
        resetPassword: (_context, event) => async (send) => {
          if (event.type !== "RESET_PASSWORD") return;

          await resetPassword(
            event.password,
            event.token,
            () => send("SUCCESSFULL_PASSWORD_RESET"),
            (error) => send({ type: "FAILED_PASSWORD_RESET", error })
          );
        },
        redirectToLogin: (_context, _event) => async (_send) => {
          router.push("/auth/login");
        },
        redirectToLocation: (context) => async () => {
          router.push(context?.location ?? "/");
        },
      },
      actions: {
        assignUserToContext: assign((context, event) => {
          if (
            event.type !== "REPORT_IS_LOGGED_IN" &&
            event.type !== "SUCCESSFULL_LOGIN" &&
            event.type !== "SUCCESSFULL_REGISTER"
          ) {
            return context;
          }

          return {
            ...context,
            auth: event.user,
          };
        }),
        clearUserDetailsFromContext: assign({
          auth: (_context, _event) => undefined,
        }),
        assignLocationToContext: assign({
          location: (_context, _event) => {
            const isProtected = protectedRoutes.some((routeRegEx) =>
              routeRegEx.test(window.location.pathname)
            );

            return isProtected ? window.location.pathname : "/";
          },
        }),
        assignErrorToContext: assign({
          error: (_context, event) => {
            if (
              event.type !== "FAILED_LOGIN" &&
              event.type !== "FAILED_REGISTER" &&
              event.type !== "FAILED_PASSWORD_RESET" &&
              event.type !== "FAILED_PASSWORD_RESET_REQUEST"
            )
              return;

            return event.error;
          },
        }),
        removeErrorFromContext: assign({
          error: (_context, _event) => undefined,
        }),
        clearWebsocketDataFromContext: assign({
          id: (_context, _event) => undefined,
          yDoc: (_context, _event) => undefined,
        }),
      },
      guards: {
        isProtectedRoute: () =>
          protectedRoutes.some((routeRegEx) =>
            routeRegEx.test(window.location.pathname)
          ),
      },
    }
  );
