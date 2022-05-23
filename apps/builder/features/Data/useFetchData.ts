import * as React from "react";
import { useAuth } from "../../features/Auth/useAuth";
import { APIError, ODProgrammerError } from "@open-decision/type-classes";

export const useFetchData = <TData, TVariables>(
  query: string,
  options?: RequestInit["headers"]
): ((variables?: TVariables) => Promise<TData>) => {
  const [state] = useAuth();

  const fetcher = React.useCallback(
    async (variables?: TVariables) => {
      const token = state.context.auth?.access.token;

      if (
        state.matches({ loggedIn: "refresh" }) ||
        state.matches("undetermined") ||
        !token
      )
        throw new ODProgrammerError({
          code: "UNAUTHENTICATED_API_CALL",
          message: "Tried to make an unauthenticated request to graphql api.",
        });

      const res = await fetch("/external-api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options ?? {}),
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const json = await res.json();

      if (json.errors) {
        const { message } = json.errors[0] || "Error..";
        throw new APIError({ code: "TREE_NOT_FOUND", message });
      }

      return json.data;
    },
    [options, query, state]
  );

  return fetcher;
};
