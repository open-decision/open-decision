import { GraphQLClient } from "graphql-request";
interface config {
  query: string;
  dataAccessor?: Function;
  token?: string;
  variables?: object;
}
export const fetchDatabase = async (
  { query, dataAccessor = (data: any) => data, token, variables }: config,
  key?: string
): Promise<any | string> => {
  const endpoint = "https://builder.open-decisions.org/graphql";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `JWT ${token}`,
    },
  });

  try {
    const response = await graphQLClient.request(query, variables);
    return dataAccessor(response);
  } catch (error) {
    return { success: false, errors: error.message };
  }
};
