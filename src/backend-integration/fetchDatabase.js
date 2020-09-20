export const fetchDatabase = async ({
  query,
  queryVariables = {},
  dataAccessor = (data) => data,
  token = "",
}) => {
  const response = await fetch("https://builder.open-decision.org/graphql", {
    method: `Post`,
    headers: {
      "Content-Type": `application/json`,
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ query: query, variables: queryVariables }),
  });

  return dataAccessor(await response.json());
};
