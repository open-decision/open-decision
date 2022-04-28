import { useActor, useInterpret } from "@xstate/react";
import { NextRouter } from "next/router";
import * as React from "react";
import {
  AuthService,
  createAuthenticationMachine,
} from "./authentication.machine";

export const AuthContext = React.createContext<AuthService | null>(null);

type AuthProviderProps = Omit<
  React.ComponentProps<typeof AuthContext.Provider>,
  "value"
> & { router: NextRouter };

export function AuthProvider({ children, router }: AuthProviderProps) {
  const authMachine = React.useCallback(
    () => createAuthenticationMachine(router),
    [router]
  );

  const service = useInterpret(authMachine);

  return (
    <AuthContext.Provider value={service}>{children}</AuthContext.Provider>
  );
}

export function useAuthService() {
  const authService = React.useContext(AuthContext);

  if (!authService) {
    throw new Error("useAuth can only be used inside of an AuthProvider");
  }

  return authService;
}

export function useAuth() {
  const service = useAuthService();

  return useActor(service);
}
