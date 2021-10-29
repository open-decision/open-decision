import { GraphQLClient } from "graphql-request";
import { createMachine, interpret } from "xstate";

const client = new GraphQLClient(
  `https://od-backend-dev.herokuapp.com/graphql`,
  { credentials: "include" }
);

const getNewToken = (client: GraphQLClient) =>
  client
    .request<{
      refreshToken: { token?: string };
    }>(`mutation REFRESH_TOKEN {refreshToken {token}}`)
    .then((data) => data.refreshToken?.token);

const removeTokenCookies = (client: GraphQLClient) =>
  client
    .request<{ deleteRefreshTokenCookie: { deleted: boolean } }>(
      `mutation DELETE_COOKIE {deleteRefreshTokenCookie {deleted} deleteTokenCookie {deleted}}`
    )
    .then((data) => console.log(data));

type Context = { client: GraphQLClient };

type State =
  | { value: "unknown"; context: Context }
  | { value: "loggedIn"; context: Context }
  | { value: "loggedOut"; context: Context };

type Events = { type: "Login" } | { type: "Logout" } | { type: "Refresh" };

const authMachine = createMachine<Context, Events, State>(
  {
    id: "auth",
    initial: "unknown",
    context: {
      /** The graphql client is configured by the state machine and reflects the
    login state by including a JWT token or not. It can then be used to make requests to the API.*/
      client,
    },
    states: {
      unknown: {
        invoke: {
          id: "getNewToken",
          src: "getNewToken",
          onDone: { target: "loggedIn", actions: "setAuthHeader" },
          onError: "loggedOut",
        },
      },
      loggedIn: {
        initial: "idle",
        states: {
          idle: {
            after: {
              300000: "refreshing",
            },
          },
          refreshing: {
            invoke: {
              id: "getNewToken",
              src: "getNewToken",
              onDone: { target: "idle", actions: "setAuthHeader" },
              onError: "#auth.loggedOut",
            },
          },
        },
        on: {
          Logout: {
            target: "loggedOut",
            actions: [
              (context, _event) => removeTokenCookies(context.client),
              (context, _event) =>
                context.client.setHeader("authorization", ""),
            ],
          },
        },
      },
      loggedOut: {
        on: {
          Login: {
            target: "loggedIn",
          },
        },
      },
    },
  },
  {
    services: {
      getNewToken: (context) => getNewToken(context.client),
    },
    actions: {
      setAuthHeader: (context, event: any) =>
        context.client.setHeader("authorization", `JWT ${event.data}`),
    },
  }
);

export const authService = interpret(authMachine);
authService.start();
