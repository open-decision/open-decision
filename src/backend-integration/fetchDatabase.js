import { GraphQLClient } from "graphql-request";
import { curry } from "ramda";

const fetchDatabase = async (
  { query, dataAccessor = (data) => data, token = "" },
  key,
  variables
) => {
  console.log(query);
  console.log({ variables });
  const endpoint = "https://builder.open-decision.org/graphql";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `JWT ${token}`,
    },
  });

  const response = await graphQLClient.request(query, variables);

  return dataAccessor(response);
};

export default curry(fetchDatabase);
