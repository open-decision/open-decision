import { TEdgePlugin } from "../plugin";
import { Tree } from "../type-classes";
import { getSingle } from "./getSingle";

export const getEdge =
  (tree: Tree.TTree) =>
  <TType extends TEdgePlugin>(edgeId: string) => {
    const edge = getSingle(tree)<TEdgePlugin>("edges")<TType>(edgeId);

    if (edge instanceof Error) throw edge;

    return edge;
  };
