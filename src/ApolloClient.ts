import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://builder.open-decision.org/graphql",
  headers: {
    authorization: `JWT ${localStorage.getItem("authToken")}`,
  },
  cache: new InMemoryCache(),
});
