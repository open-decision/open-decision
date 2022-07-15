import * as React from "react";
import {
  client,
  TAuthenticatedClient,
  TUnauthenticatedClient,
} from "@open-decision/api-client";
import { TJWT } from "@open-decision/api-helpers";
import { ODProgrammerError } from "@open-decision/type-classes";

export const ODContext = React.createContext<{ token?: TJWT }>({
  token: undefined,
});

export function useOD(type?: "authenticated"): TAuthenticatedClient;
export function useOD(type?: "unauthenticated"): TUnauthenticatedClient;
export function useOD(
  type: "unauthenticated" | "authenticated" = "authenticated"
): TAuthenticatedClient | TUnauthenticatedClient {
  const { token } = React.useContext(ODContext);

  if (type === "authenticated") {
    if (!token)
      throw new ODProgrammerError({
        code: "UNAUTHENTICATED_API_CALL",
        message:
          "You tried to make an authenticated API call without access to a user access token. This could be the result of not having the ODContextProvider wrapped around the component calling it. ",
      });

    return client({
      token,
      urlPrefix: process.env.NEXT_PUBLIC_OD_API_ENDPOINT,
    });
  }

  return client({ urlPrefix: process.env.NEXT_PUBLIC_OD_API_ENDPOINT });
}

export const ODProvider = ODContext.Provider;
