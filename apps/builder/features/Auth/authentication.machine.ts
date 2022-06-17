import { NextRouter } from "next/router";
import { assign, createMachine, Interpreter } from "xstate";
import { Doc } from "yjs";
import { refreshMachine } from "./refresh.machine";
import * as Sentry from "@sentry/nextjs";
import { protectedRoutes } from "../../config/protectedRoutes";
import { websocketMachine } from "../Data/websocket.machine";
import {
  TLoginOutput,
  TRefreshTokenOutput,
  TRegisterOutput,
} from "@open-decision/auth-api-specification";
import {
  client,
  TAuthenticatedClient,
  TUnauthenticatedClient,
} from "@open-decision/api-client";

const createClient = ({
  urlPrefix = "/external-api",
  ...context
}: Parameters<typeof client>[0]) => client({ urlPrefix, ...context });

type SharedContext = {
  location?: string;
  error?: string;
  id?: string;
  yDoc?: Doc;
};

type EmptyContext = {
  auth: undefined;
  client: TUnauthenticatedClient;
} & SharedContext;

type DefinedContext = {
  auth: TLoginOutput;
  client: TAuthenticatedClient;
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

export type AuthService = Interpreter<Context, any, Events, State, any>;

export const createAuthenticationMachine = (router: NextRouter) =>
  createMachine<Context, Events, State>(
    {
      id: "authentication",
      initial: "undetermined",
      context: {
        client: createClient({}),
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
                actions: [
                  "assignUserToContext",
                  "assignAuthenticatedClient",
                  "assignLocationToContext",
                  "setTrackingUser",
                ],
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
                      actions: [
                        "assignUserToContext",
                        "assignAuthenticatedClient",
                      ],
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
                    data: (context, event: OPEN_WEBSOCKET_EVENT) => ({
                      token: context.auth?.access.token,
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
          context.client.auth
            .refreshToken({})
            .then((user) =>
              send({
                type: "REPORT_IS_LOGGED_IN",
                user,
              })
            )
            .catch(() => send({ type: "REPORT_IS_LOGGED_OUT" }));
        },
        login: (context, event) => async (send) => {
          if (event.type !== "LOG_IN") return;
          const { email, password } = event;

          context.client.auth
            .login({ body: { email, password } })
            .then((data) =>
              send({
                type: "SUCCESSFULL_LOGIN",
                user: data,
              })
            )
            .catch((error) => {
              console.log(error);
              return send({ type: "FAILED_LOGIN", error });
            });
        },
        register: (context, event) => async (send) => {
          if (event.type !== "REGISTER") return;

          const { email, password, toc } = event;

          context.client.auth
            .register({ body: { email, password, toc } })
            .then((user) =>
              send({
                type: "SUCCESSFULL_REGISTER",
                user,
              })
            )
            .catch((error) => send({ type: "FAILED_REGISTER", error }));
        },
        logout: (context, event) => async (send) => {
          if (event.type !== "LOG_OUT") return;
          if (!context.auth) return;

          context.client.auth
            .logout({})
            .then(() => send({ type: "SUCCESSFULL_LOGOUT" }))
            .catch(() => send({ type: "FAILED_LOGOUT" }));
        },
        requestPasswordReset: (context, event) => async (send) => {
          if (event.type !== "REQUEST_PASSWORD_RESET") return;

          context.client.auth
            .forgotPassword({ body: { email: event.email } })
            .then(() => send("SUCCESSFULL_PASSWORD_RESET_REQUEST"))
            .catch((error) =>
              send({ type: "FAILED_PASSWORD_RESET_REQUEST", error })
            );
        },
        resetPassword: (context, event) => async (send) => {
          if (event.type !== "RESET_PASSWORD") return;

          context.client.auth
            .resetPassword({
              body: { password: event.password, token: event.token },
            })
            .then(() => send("SUCCESSFULL_PASSWORD_RESET"))
            .catch((error) => send({ type: "FAILED_PASSWORD_RESET", error }));
        },
        redirectToLogin: (_context, _event) => async (_send) => {
          router.push("/auth/login");
        },
        redirectToLocation: (context) => async () => {
          router.push(context?.location ?? "/");
        },
      },
      actions: {
        setTrackingUser: (context, _event) => {
          if (!context.auth) return;

          Sentry.setUser({
            email: context.auth?.user.email,
            id: context.auth.user.uuid,
          });
        },
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
        assignAuthenticatedClient: assign({
          client: (context, event) => {
            if (
              event.type !== "SUCCESSFULL_LOGIN" &&
              event.type !== "REPORT_IS_LOGGED_IN"
            )
              return context.client;

            return createClient({ token: event.user.access.token });
          },
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
