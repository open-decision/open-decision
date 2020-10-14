import { createClient } from "urql";

export const client = createClient({
  url: "https://builder.open-decision.org/graphql",
  fetchOptions: () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    };
  },
});
