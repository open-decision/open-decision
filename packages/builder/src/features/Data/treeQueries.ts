import { gql } from "graphql-request";

gql`
  query Trees {
    decisionTrees {
      id
      uuid
      name
      updatedAt
      createdAt
      tags
    }
  }
`;

gql`
  query getFullTree($id: Int!) {
    decisionTree(where: { id: $id }) {
      id
      createdAt
      name
      treeData
      updatedAt
      tags
    }
  }
`;
