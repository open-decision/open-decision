import { gql } from "graphql-request";

gql`
  mutation publishTree($uuid: String!) {
    publishDecisionTree(where: { uuid: $uuid }) {
      uuid
    }
  }
`;

gql`
  mutation unPublishTree($uuid: String!) {
    publishDecisionTree(where: { uuid: $uuid }) {
      uuid
    }
  }
`;
