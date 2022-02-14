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
  mutation patchTree($data: DecisionTreePartialUpdateInput!, $id: Int!) {
    updatePartialDecisionTree(data: $data, where: { id: $id }) {
      id
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
