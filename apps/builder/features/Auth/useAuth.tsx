import { TLoginOutput } from "@open-decision/auth-api-specification";
import { ODProgrammerError } from "@open-decision/type-classes";
import { useActor, useInterpret } from "@xstate/react";
import { useRouter } from "next/router";
import * as React from "react";
import { ODProvider } from "../Data/odClient";
import {
  AuthService,
  createAuthenticationMachine,
} from "./authentication.machine";

export const AuthContext = React.createContext<AuthService | null>(null);

type AuthProviderProps = Omit<
  React.ComponentProps<typeof AuthContext.Provider>,
  "value"
> & {
  initial: Parameters<typeof createAuthenticationMachine>[0];
} & TLoginOutput;

export function AuthProvider({
  children,
  initial,
  user,
  access,
}: AuthProviderProps) {
  const router = useRouter();
  const authMachine = React.useCallback(
    () =>
      createAuthenticationMachine(initial, user, access, () =>
        router.push("/auth/login")
      ),
    [initial, user, access, router]
  );

  const service = useInterpret(authMachine, { devTools: true });

  return (
    <ODProvider value={{ token: access.token }}>
      <AuthContext.Provider value={service}>{children}</AuthContext.Provider>
    </ODProvider>
  );
}

export function useAuthService() {
  const authService = React.useContext(AuthContext);

  if (!authService) {
    throw new ODProgrammerError({
      code: "MISSING_CONTEXT_PROVIDER",
      message: "useAuth can only be used inside of an AuthProvider",
    });
  }

  return authService;
}

export function useAuth() {
  const service = useAuthService();

  return useActor(service);
}
