import * as React from "react";
import { client } from "@open-decision/api-client";
import { TJWT } from "@open-decision/api-helpers";

export const ODContext = React.createContext<{ token?: TJWT }>({
  token: undefined,
});

export function useOD() {
  return client({
    requestOrigin: "client",
    urlPrefix: `${process.env.NEXT_PUBLIC_URL}/api/external-api`,
  });
}

export const ODProvider = ODContext.Provider;
