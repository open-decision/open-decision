import { gql } from "graphql-request";

gql`
  query Trees {
    decisionTrees {
      uuid
      name
      updatedAt
      createdAt
      tags
    }
  }
`;

gql`
  query getTreeName($uuid: String!) {
    decisionTree(where: { uuid: $uuid }) {
      name
    }
  }
`;
