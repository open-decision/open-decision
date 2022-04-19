import { gql } from "graphql-request";

gql`
  query Trees {
    decisionTrees {
      uuid
      name
      updatedAt
      createdAt
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

gql`
  query getTreeContent($uuid: String!) {
    decisionTree(where: { uuid: $uuid }) {
      treeData
    }
  }
`;
