import { assign, createMachine, Sender } from "xstate";
import { login } from "./utils/login";
import { logout } from "./utils/logout";
import { refresh } from "./utils/refresh";

export type AuthenticationMachineContext = {
  user?: User;
};

interface User {
  username: string;
  token: string;
}

export type AuthenticationMachineEvent =
  | {
      type: "REPORT_IS_LOGGED_IN";
      user: User;
    }
  | {
      type: "REPORT_IS_LOGGED_OUT";
    }
  | {
      type: "LOG_OUT";
    }
  | {
      type: "LOG_IN";
    }
  | { type: "SUCCESSFULL_LOGIN"; user: User }
  | { type: "FAILED_LOGIN" }
  | { type: "SAFE_USER"; user: User };

const authenticationMachine = createMachine<
  AuthenticationMachineContext,
  AuthenticationMachineEvent
>(
  {
    id: "authentication",
    initial: "undetermined",
    context: { user: undefined },
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
          REPORT_IS_LOGGED_OUT: "loggedOut",
        },
      },
      loggedIn: {
        on: {
          LOG_OUT: {
            target: "loggedOut",
            actions: logout,
          },
        },
      },
      loggedOut: {
        entry: "clearUserDetailsFromContext",
        initial: "idle",
        on: {
          LOG_IN: {
            target: ".loggingIn",
            actions: login,
          },
        },
        states: {
          idle: {},
          loggingIn: {
            invoke: {
              src: "login",
            },
            on: {
              SUCCESSFULL_LOGIN: {
                target: "#authentication.loggedIn",
                actions: "assignUserToContext",
              },
              FAILED_LOGIN: {
                target: "#authentication.loggedOut",
                actions: "clearUserDetailsFromContext",
              },
            },
          },
        },
      },
    },
  },
  {
    services: {
      checkIfLoggedIn:
        () => async (send: Sender<AuthenticationMachineEvent>) => {
          try {
            const {
              access: { token },
            } = await refresh();

            if (token)
              send({
                type: "REPORT_IS_LOGGED_IN",
                user: { username: "test", token },
              });
          } catch (error) {
            send({ type: "REPORT_IS_LOGGED_OUT" });
          }
        },
      login: () => async (send: Sender<AuthenticationMachineEvent>) => {
        try {
          const {
            access: { token },
          } = await login();

          if (token)
            send({
              type: "SUCCESSFULL_LOGIN",
              user: { username: "test", token },
            });
        } catch (error) {
          send({ type: "FAILED_LOGIN" });
        }
      },
    },
    actions: {
      assignUserToContext: assign((_context, event) => {
        if (
          event.type !== "REPORT_IS_LOGGED_IN" &&
          event.type !== "SUCCESSFULL_LOGIN"
        ) {
          return {};
        }

        return {
          user: event.user,
        };
      }),
      clearUserDetailsFromContext: assign({
        user: (_context, _event) => undefined,
      }),
    },
  }
);

export default authenticationMachine;
