export const treesRoot = "trees";

export const treesSingle = (treeUuid: string) => `${treesRoot}/${treeUuid}`;

export const treeDataSingle = (treeUuid: string) =>
  `${treesSingle(treeUuid)}/data`;

export const treePreview = (treeUuid: string) =>
  `${treesSingle(treeUuid)}/prototype`;

export const publishedTreesRoot = "publishedTrees";
export const publishedTreesSingle = (publishedTreesUuid: string) =>
  `${publishedTreesRoot}/${publishedTreesUuid}`;

export const publishedTreesOfTreesCollection = (treeUuid: string) =>
  `${treesSingle(treeUuid)}/publishedTrees`;

export const publishedTreesOfTreesSingle = (
  treeUuid: string,
  publishedTreeUuid: string
) => `${publishedTreesOfTreesCollection(treeUuid)}/${publishedTreeUuid}`;
