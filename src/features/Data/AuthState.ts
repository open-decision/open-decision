import create from "zustand";
import { devtools } from "zustand/middleware";
import { GraphQLClient } from "graphql-request";

type loggedOut = {
  status: "loggedOut";
  token: undefined;
  refreshExpiresIn: undefined;
  refreshToken: undefined;
};

type loggedIn = {
  status: "loggedIn";
  token: string;
  refreshExpiresIn: number;
  refreshToken: string;
};

type authState = (loggedOut | loggedIn) & {
  client: GraphQLClient;
};

type AuthState = authState & {
  login: (authState: Omit<loggedIn, "status">) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>(
  devtools(
    (set) => ({
      status: "loggedOut",
      token: undefined,
      refreshExpiresIn: undefined,
      refreshToken: undefined,
      client: new GraphQLClient(
        "https://od-backend-dev.herokuapp.com/graphql",
        { credentials: "include" }
      ),
      login: (authState) =>
        set((state) => {
          state.client.setHeader("authorization", `JWT ${authState.token}`);

          return { status: "loggedIn", ...authState };
        }),
      logout: () =>
        set((state) => {
          state.client.setHeader("authorization", "");

          return {
            status: "loggedOut",
            token: undefined,
            refreshExpiresIn: undefined,
            refreshToken: undefined,
          };
        }),
    }),
    "Auth"
  )
);
