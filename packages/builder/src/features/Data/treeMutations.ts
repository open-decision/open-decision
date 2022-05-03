import { gql } from "graphql-request";

gql`
  mutation createTree($data: DecisionTreeCreateInput!) {
    createDecisionTree(data: $data) {
      uuid
    }
  }
`;

gql`
  mutation updateTree($data: DecisionTreeUpdateInput!, $uuid: String!) {
    updateDecisionTree(data: $data, where: { uuid: $uuid }) {
      uuid
      createdAt
      name
      treeData
      updatedAt
    }
  }
`;

gql`
  mutation deleteTree($uuid: String!) {
    deleteDecisionTree(where: { uuid: $uuid }) {
      uuid
    }
  }
`;
