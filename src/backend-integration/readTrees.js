export const readTrees = () =>
  fetch("https://builder.open-decision.org/graphql", {
    method: `Post`,
    headers: {
      "Content-Type": `application/json`,
    },
    body: JSON.stringify({ query: GET_METADATA }),
  }).then((response) => response.json());

const GET_METADATA = `
{
    allDecisionTrees {
      edges {
        node {
          id
          name
          slug
          tags
          createdAt
        }
      }
    }
  }`;
