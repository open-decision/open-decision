import { DecisionTreeNode } from "generated/graphql";
import gql from "graphql-tag";

export type TreeNodes = {
  __typename?: "DecisionTreeNode";
} & Pick<DecisionTreeNode, "id" | "name" | "slug" | "tags" | "createdAt">[];
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
