import { DecisionTree } from "@prisma/client";
import { query } from "express";

export const createTree = (name: string) => ({
  query: `#graphql 
  mutation ($name: String!) {
    createDecisionTree(data: { name: $name }) {
      id
      createdAt
      updatedAt
      name
      tags
      treeData
      language
    }
  }
  `,
  variables: {
    name,
  },
});

export const getSingleTree = (id: number) => ({
  query: `#graphql
    query ($id: Int!){
      decisionTree(where: {
      id: $id
    }) {
      id
      name
    }
}`,
  variables: { id },
});

export const getManyTrees = (whereInput: any) => ({
  query: `#graphql
  query($whereInput: DecisionTreeWhereInput!){
    decisionTrees(
      where: $whereInput,
      orderBy: [{}]
      distinct: [id]
    ) {
      id
      name
    }
  }`,
  variables: {
    whereInput,
  },
});

export const updateSingleTree = (data: Partial<DecisionTree>, id: number) => ({
  query: `#graphql
  mutation ($data: DecisionTreeUpdateInput!, $id: Int!){
    updateDecisionTree(data: $data, where: {id:$id }) {
      id
      name
      treeData
    }
  }
  `,
  variables: { data, id },
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

export const deleteSingleTree = (id: number) => ({
  query: `#graphql
  mutation ($id: Int!){
    deleteDecisionTree(where: {id: $id}) {
      id 
      name
    }
  }
  `,
  variables: {
    id,
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
