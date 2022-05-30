import { gql } from "graphql-request";

gql`
  query Trees {
    decisionTrees {
      uuid
      name
      updatedAt
      createdAt
      status
    }
  }
`;

gql`
  query Tree($uuid: String!) {
    decisionTree(where: { uuid: $uuid }) {
      name
    }
  }
`;
