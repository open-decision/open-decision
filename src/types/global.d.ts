import { DecisionTreeNode } from "./generated/graphql";
import { FunctionComponent } from "react";

export type Component<T = Record<string, unknown>> = FunctionComponent<
  T & GlobalProps
>;
export type Tag = { name: string; color: string };

export type Tree = {
  name: string;
  tags: Tag[];
  createdAt: string;
  id: string;
};

export type LocationState = {
  from: { pathname: string };
};

export type treeObject = {
  id: string;
  name: string;
  slug: string;
  tags?: [];
  createdAt: string;
};

export type allTreeData = {
  allDecisionTrees: { edges: { node: treeObject }[] };
};

interface GlobalProps {
  className?: string;
}

export type TreeNodes = {
  __typename?: "DecisionTreeNode";
} & Pick<DecisionTreeNode, "id" | "name" | "slug" | "tags" | "createdAt">[];
