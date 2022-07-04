import { assign, createMachine, Interpreter } from "xstate";
import { Doc } from "yjs";
import { refreshMachine } from "./refresh.machine";
import { websocketMachine } from "../Data/websocket.machine";
import {
  TLoginOutput,
  TRefreshTokenOutput,
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
  | { type: "REPORT_IS_LOGGED_IN"; data: TRefreshTokenOutput }
  | { type: "REPORT_IS_LOGGED_OUT" }
  | { type: "LOG_OUT" }
  | { type: "REFRESH" }
  | OPEN_WEBSOCKET_EVENT
  | { type: "WEBSOCKET_CONNECTION_FAILED" }
  | { type: "WEBSOCKET_CLOSED" }
  | { type: "CLOSE_WEBSOCKET" };

export type AuthService = Interpreter<Context, any, Events, any, any>;

export const createAuthenticationMachine = (
  initial: "loggedIn" | "loggedOut",
  user: TLoginOutput["user"],
  access: TLoginOutput["access"],
  onLogout: () => void
) =>
  createMachine<Context, Events, any>(
    {
      id: "authentication",
      initial,
      context: {
        client: client({
          token: access.token,
          urlPrefix: "/external-api",
        }),
        user,
        access,
        error: undefined,
      },
      states: {
        loggedIn: {
          type: "parallel",
          on: {
            LOG_OUT: "loggedIn.authentication.loggingOut",
          },
          states: {
            authentication: {
              initial: "idle",

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
                refresh: {
                  invoke: {
                    src: "checkIfLoggedIn",
                    onError: {
                      actions: "logout",
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
                  },
                },
                loggingOut: {
                  type: "final",
                  invoke: {
                    src: "logout",
                    onDone: {
                      actions: onLogout,
                    },
                    onError: {
                      actions: onLogout,
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
                    LOG_OUT: "unconnected",
                  },
                },
                connect_failed: {
                  type: "final",
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
          const response = await context.client.auth.refreshToken({});

          return send({
            type: "REPORT_IS_LOGGED_IN",
            data: response.data,
          });
        },

        logout: (context, event) => async () => {
          if (event.type !== "LOG_OUT") return;

          await context.client.auth.logout({});
        },
      },
      actions: {
        assignUserToContext: assign({
          //@ts-expect-error - Typechecking fails here, because undefined is not assignable to auth in all situations
          auth: (_, event) => {
            if (event.type !== "REPORT_IS_LOGGED_IN") {
              return;
            }

            return event.user;
          },
        }),
        clearWebsocketDataFromContext: assign({
          id: (_context, _event) => undefined,
          yDoc: (_context, _event) => undefined,
        }),
        assignAuthenticatedClient: assign({
          client: (context, event) => {
            if (event.type !== "REPORT_IS_LOGGED_IN") return context.client;

            return client({
              token: event.data.access.token,
              urlPrefix: "/external-api",
            });
          },
        }),
      },
    }
  );
