import { gql } from "graphql-request";

gql`
  mutation archiveTree($uuid: String!) {
    updateDecisionTree(
      where: { uuid: $uuid }
      data: { status: { set: ARCHIVED } }
    ) {
      uuid
    }
  }
`;

gql`
  mutation unArchiveTree($uuid: String!) {
    updateDecisionTree(
      where: { uuid: $uuid }
      data: { status: { set: ACTIVE } }
    ) {
      uuid
    }
  }
`;
