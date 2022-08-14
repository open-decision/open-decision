import { createTree } from "./createTree";

export const getTreesFromENV = () => {
  if (!process.env["TREES"]) throw new Error("TREES is not defined");
  const trees = JSON.parse(process.env["TREES"]);
  return trees as Awaited<ReturnType<typeof createTree>>[];
};

export const getTreeFromENV = (name: string) => {
  const trees = getTreesFromENV();
  const tree = trees.find((tree) => tree.name === name);
  if (!tree) throw new Error(`Tree ${name} is not defined`);
  return tree;
};
