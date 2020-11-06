import gql from "graphql-tag";

export const ALL_TREES = gql`
  query ALL_TREES {
    allDecisionTrees {
      edges {
        node {
          id
          name
          slug
          tags
          createdAt
        }
      }
    }
  }
`;

export const CREATE_TREE = gql`
  mutation CREATE_TREE($input: CreateDecisionTreeMutationInput!) {
    createTree(input: $input) {
      tree {
        id
        name
        extraData
        tags
      }
    }
  }
`;
