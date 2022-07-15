import { assign, createMachine, Interpreter } from "xstate";
import { Doc } from "yjs";
import { refreshMachine } from "./refresh.machine";
import { websocketMachine } from "../Data/websocket.machine";
import {
  TLoginOutput,
  TRefreshTokenOutput,
  TRegisterOutput,
} from "@open-decision/auth-api-specification";
import { client, TAuthenticatedClient } from "@open-decision/api-client";

export type Context = {
  client: TAuthenticatedClient;
  error?: string;
  id?: string;
  yDoc?: Doc;
} & TLoginOutput;
type OPEN_WEBSOCKET_EVENT = {
  type: "OPEN_WEBSOCKET";
  id: string;
  yDoc: Doc;
  onSync: (value: unknown) => void;
};

export type Events =
  | { type: "REPORT_IS_LOGGED_IN"; user: TRefreshTokenOutput }
  | { type: "REPORT_IS_LOGGED_OUT" }
  | { type: "LOG_OUT" }
  | { type: "LOG_IN"; email: string; password: string }
  | { type: "SUCCESSFULL_LOGIN"; user: TLoginOutput }
  | { type: "FAILED_LOGIN"; error: string }
  | { type: "SAFE_USER"; user: TLoginOutput }
  | { type: "REGISTER"; email: string; password: string; toc: true }
  | { type: "SUCCESSFULL_REGISTER"; user: TRegisterOutput }
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
  | OPEN_WEBSOCKET_EVENT
  | { type: "WEBSOCKET_CONNECTION_FAILED" }
  | { type: "WEBSOCKET_CLOSED" }
  | { type: "CLOSE_WEBSOCKET" };

export type AuthService = Interpreter<Context, any, Events, any, any>;

export const createAuthenticationMachine = (
  initial: "loggedIn" | "loggedOut",
  user: TLoginOutput["user"],
  access: TLoginOutput["access"]
) =>
  createMachine<Context, Events, any>(
    {
      id: "authentication",
      initial,
      context: {
        client: client({
          token: access.token,
          urlPrefix: process.env.NEXT_PUBLIC_OD_API_ENDPOINT,
        }),
        user,
        access,
        error: undefined,
      },
      states: {
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
                      expires: (context: Context) => context.access.expires,
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
                      actions: [
                        "assignUserToContext",
                        "assignAuthenticatedClient",
                      ],
                    },
                    REPORT_IS_LOGGED_OUT: "#authentication.loggedOut.idle",
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
                    data: (context, event: OPEN_WEBSOCKET_EVENT) => ({
                      token: context.access.token,
                      id: event.id,
                      yDoc: event.yDoc,
                      onSync: event.onSync,
                      retryLimit: 3,
                      retries: 0,
                    }),
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
                  actions: [
                    "assignUserToContext",
                    "assignAuthenticatedClient",
                    "removeErrorFromContext",
                  ],
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
                  actions: ["assignUserToContext", "assignAuthenticatedClient"],
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
        checkIfLoggedIn: (context) => async (send) => {
          try {
            const response = await context.client.auth.refreshToken({});

            if (response instanceof Error) throw response;

            return send({
              type: "REPORT_IS_LOGGED_IN",
              user: response,
            });
          } catch (error) {
            return send({ type: "REPORT_IS_LOGGED_OUT" });
          }
        },
        login: (context, event) => async (send) => {
          if (event.type !== "LOG_IN") return;
          const { email, password } = event;

          try {
            const response = await context.client.auth.login({
              body: { email, password },
            });

            if (response instanceof Error) throw response;

            return send({
              type: "SUCCESSFULL_LOGIN",
              user: response,
            });
          } catch (error) {
            if (error instanceof Error)
              return send({ type: "FAILED_LOGIN", error: error.message });
          }
        },
        register: (context, event) => async (send) => {
          if (event.type !== "REGISTER") return;

          const { email, password, toc } = event;
          try {
            const response = await context.client.auth.register({
              body: { email, password, toc },
            });

            if (response instanceof Error) throw response;

            return send({
              type: "SUCCESSFULL_REGISTER",
              user: response,
            });
          } catch (error) {
            if (error instanceof Error)
              return send({ type: "FAILED_REGISTER", error: error.message });
          }
        },
        logout: (context, event) => async (send) => {
          if (event.type !== "LOG_OUT") return;

          try {
            await context.client.auth.logout({});

            return send({ type: "SUCCESSFULL_LOGOUT" });
          } catch (error) {
            if (error instanceof Error) return send({ type: "FAILED_LOGOUT" });
          }
        },
        requestPasswordReset: (context, event) => async (send) => {
          if (event.type !== "REQUEST_PASSWORD_RESET") return;
          try {
            await context.client.auth.forgotPassword({
              body: { email: event.email },
            });

            return send("SUCCESSFULL_PASSWORD_RESET_REQUEST");
          } catch (error) {
            if (error instanceof Error)
              return send({
                type: "FAILED_PASSWORD_RESET_REQUEST",
                error: error.message,
              });
          }
        },
        resetPassword: (context, event) => async (send) => {
          if (event.type !== "RESET_PASSWORD") return;
          try {
            await context.client.auth.resetPassword({
              body: { password: event.password, token: event.token },
            });

            return send("SUCCESSFULL_PASSWORD_RESET");
          } catch (error) {
            if (error instanceof Error)
              return send({
                type: "FAILED_PASSWORD_RESET",
                error: error.message,
              });
          }
        },
      },
      actions: {
        assignUserToContext: assign({
          //@ts-expect-error - Typechecking fails here, because undefined is not assignable to auth in all situations
          auth: (_, event) => {
            if (
              event.type !== "REPORT_IS_LOGGED_IN" &&
              event.type !== "SUCCESSFULL_LOGIN" &&
              event.type !== "SUCCESSFULL_REGISTER"
            ) {
              return;
            }

            return event.user;
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
    }
  );
