import { FunctionComponent } from "react";
import { tagColors } from "@components/index";

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

export type TreeNode = {
  id: string;
  name: string;
  slug: string;
  tags: { name: string; color: tagColors }[];
  createdAt: string;
};
