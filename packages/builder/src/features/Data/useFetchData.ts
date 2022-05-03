import * as React from "react";
import { useAuth } from "features/Auth/useAuth";

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
        state.matches("undetermined")
      )
        throw new Error("Is not ready");

      const res = await fetch("/api/graphql", {
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
        throw new Error(message);
      }

      return json.data;
    },
    [options, query, state]
  );

  return fetcher;
};
