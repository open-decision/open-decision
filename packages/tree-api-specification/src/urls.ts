export const treesCollection = "/trees";

export const treesSingle = (treeUuid: string) =>
  `${treesCollection}/${treeUuid}`;

export const treesDataSingle = (treeUuid: string) =>
  `${treesSingle(treeUuid)}/data`;

export const publishedTreesCollection = "/publishedTrees";
export const publishedTreesSingle = (publishedTreesUuid: string) =>
  `${publishedTreesCollection}/${publishedTreesUuid}`;

export const publishedTreesOfTreesCollection = (treeUuid: string) =>
  `${treesSingle(treeUuid)}/publishedTrees`;

export const publishedTreesOfTreesSingle = (
  treeUuid: string,
  publishedTreeUuid: string
) => `${publishedTreesOfTreesCollection(treeUuid)}/${publishedTreeUuid}`;
