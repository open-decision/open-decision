import { useAuth } from "features/Auth/useAuth";

export const useFetchData = <TData, TVariables>(
  query: string,
  options?: RequestInit["headers"]
): ((variables?: TVariables) => Promise<TData>) => {
  const [state] = useAuth();

  return async (variables?: TVariables) => {
    if (state.matches("undetermined")) return;

    const res = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.context.user?.access.token}`,
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
  };
};
