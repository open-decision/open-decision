import { createClient, defaultExchanges } from "urql";
import { devtoolsExchange } from "@urql/devtools";

const getToken = () => localStorage.getItem("authToken");
export const client = createClient({
  url: "https://builder.open-decision.org/graphql",
  exchanges: [devtoolsExchange, ...defaultExchanges],
  fetchOptions: () => {
    const token = getToken();
    return {
      headers: { authorization: token ? `JWT ${token}` : "" },
    };
  },
});
