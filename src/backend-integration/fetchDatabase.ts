import { GraphQLClient } from "graphql-request";
interface config {
  query: string;
  dataAccessor?: (data: unknown) => Record<string, unknown> | Record<string, unknown>[];
  token?: string;
  variables?: Record<string, unknown>;
}

interface fetchDatabase {
  (config: config, key?: string): Promise<{ success: boolean; data?: unknown; errors?: string }>;
}
export const fetchDatabase: fetchDatabase = async ({ query, dataAccessor, token, variables }, key) => {
  const endpoint = "https://builder.open-decision.org/graphql";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `JWT ${token}`,
    },
  });

  try {
    const response = await graphQLClient.request(query, variables);
    return { success: true, data: dataAccessor(response) };
  } catch (error) {
    return { success: false, errors: error.message };
  }
};
