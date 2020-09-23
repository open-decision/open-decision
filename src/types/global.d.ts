export type Tag = {
  name: string;
  color: string;
};
export type Tree = {
  name: string;
  tags: Tag[];
  createdAt: string;
  id: string;
};
export type LocationState = {
  from: {
    pathname: string;
  };
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

export type GlobalProps = {
  className?: string;
};
