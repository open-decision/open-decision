import { TNodePlugin } from "../plugin";
import { Tree } from "../type-classes";
import { getSingle } from "./getSingle";

export const getNode =
  (tree: Tree.TTree) =>
  <TType extends TNodePlugin>(edgeId: string) => {
    const edge = getSingle(tree)<TNodePlugin>("nodes")<TType>(edgeId);

    if (edge instanceof Error) throw edge;

    return edge;
  };
