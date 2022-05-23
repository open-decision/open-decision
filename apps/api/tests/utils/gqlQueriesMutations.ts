import { DecisionTree } from "@open-decision/models/prisma-client";

export const createTree = (name: string) => ({
  query: `#graphql
  mutation ($name: String!) {
    createDecisionTree(data: { name: $name }) {
      uuid
      createdAt
      updatedAt
      name
      treeData
      status
    }
  }
  `,
  variables: {
    name,
  },
});

export const getSingleTree = (uuid: string) => ({
  query: `#graphql
    query ($uuid: String!){
      decisionTree(where: {
      uuid: $uuid
    }) {
      uuid
      name
    }
}`,
  variables: { uuid },
});

export const getManyTrees = (whereInput: any) => ({
  query: `#graphql
  query($whereInput: DecisionTreeWhereInput!){
    decisionTrees(
      where: $whereInput,
      orderBy: [{}]
      distinct: [uuid]
    ) {
      uuid
      name
    }
  }`,
  variables: {
    whereInput,
  },
});

export const updateSingleTree = (
  data: Partial<DecisionTree>,
  uuid: string
) => ({
  query: `#graphql
  mutation ($data: DecisionTreeUpdateInput!, $uuid: String!){
    updateDecisionTree(data: $data, where: {uuid:$uuid }) {
      uuid
      name
      status
    }
  }
  `,
  variables: { data, uuid },
});

export const updateManyTree = (
  data: Partial<DecisionTree>,
  whereInput: any
) => ({
  query: `#graphql
  mutation ($data: DecisionTreeUpdateManyMutationInput!, $whereInput: DecisionTreeWhereInput!) {
    updateManyDecisionTree(data: $data, where: $whereInput) {
      count
    }
  }
  `,
  variables: {
    data,
    whereInput,
  },
});

export const deleteSingleTree = (uuid: string) => ({
  query: `#graphql
  mutation ($uuid: String!){
    deleteDecisionTree(where: {uuid: $uuid}) {
      uuid
      name
    }
  }
  `,
  variables: {
    uuid,
  },
});

export const deleteManyTree = (whereInput: any) => ({
  query: `#graphql
  mutation ($whereInput: DecisionTreeWhereInput!){
    deleteManyDecisionTree(where: $whereInput) {
      count
    }
  }
  `,
  variables: {
    whereInput,
  },
});
