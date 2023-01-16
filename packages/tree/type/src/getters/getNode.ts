import { INodePlugin } from "../plugin";
import { Tree } from "../type-classes";
import { getSingle } from "./getSingle";

export const getNode =
  (tree: Tree.TTree) =>
  <TType extends INodePlugin>(edgeId: string) => {
    const edge = getSingle(tree)<INodePlugin>("nodes")<TType>(edgeId);

    if (edge instanceof Error) throw edge;

    return edge;
  };
