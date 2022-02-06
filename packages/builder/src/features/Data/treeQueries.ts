import { gql } from "graphql-request";

gql`
  query Trees {
    decisionTrees {
      id
      name
      updatedAt
      createdAt
      tags
    }
  }
`;
