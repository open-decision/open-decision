import { gql } from "graphql-request";

gql`
  mutation createTree($data: DecisionTreeCreateInput!) {
    createDecisionTree(data: $data) {
      id
    }
  }
`;

gql`
  mutation updateTree($data: DecisionTreeUpdateInput!, $id: Int!) {
    updateDecisionTree(data: $data, where: { id: $id }) {
      id
      createdAt
      name
      treeData
      updatedAt
    }
  }
`;

gql`
  mutation deleteTree($id: Int!) {
    deleteDecisionTree(where: { id: $id }) {
      id
    }
  }
`;
