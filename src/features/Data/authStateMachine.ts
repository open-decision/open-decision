import { GraphQLClient } from "graphql-request";
import { createContext } from "react";
import { createMachine, Interpreter } from "xstate";

const client = new GraphQLClient(
  "https://od-backend-dev.herokuapp.com/graphql",
  { credentials: "include" }
);

const getNewToken = (client: GraphQLClient) =>
  client
    .request<{
      refreshToken: { token?: string };
    }>(`mutation REFRESH_TOKEN {refreshToken {token}}`)
    .then((data) => data.refreshToken?.token)
    .catch(console.log);

const removeTokenCookies = (client: GraphQLClient) =>
  client
    .request<{ deleteRefreshTokenCookie: { deleted: boolean } }>(
      `mutation DELETE_COOKIE {
    deleteRefreshTokenCookie {
      deleted
    }
    deleteTokenCookie {
      deleted
    }
  }`
    )
    .then((data) => console.log(data))
    .catch(console.log);

type AuthContext = { client: GraphQLClient };

type AuthState =
  | { value: "unknown"; context: { client: GraphQLClient } }
  | { value: "loggedIn"; context: { client: GraphQLClient } }
  | { value: "loggedOut"; context: { client: GraphQLClient } };

type AuthEvents = { type: "Login" } | { type: "Logout" };

export const authStateMachine = createMachine<
  AuthContext,
  AuthEvents,
  AuthState
>({
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
        src: (context) => getNewToken(context.client),
        onDone: {
          target: "loggedIn",
          actions: (context, event) =>
            context.client.setHeader("authorization", `JWT ${event.data}`),
        },
        onError: {
          target: "loggedOut",
        },
      },
    },
    loggedIn: {
      on: {
        Logout: {
          target: "loggedOut",
          actions: [
            (context, _event) => removeTokenCookies(context.client),
            (context, _event) => context.client.setHeader("authorization", ""),
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
});

export const AuthServiceContext = createContext<
  Interpreter<AuthContext, AuthState, AuthEvents>
>({} as Interpreter<AuthContext, AuthState, AuthEvents>);
