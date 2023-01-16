import { IEdgePlugin } from "../plugin";
import { Tree } from "../type-classes";
import { getSingle } from "./getSingle";

export const getEdge =
  (tree: Tree.TTree) =>
  <TType extends IEdgePlugin>(edgeId: string) => {
    const edge = getSingle(tree)<IEdgePlugin>("edges")<TType>(edgeId);

    if (edge instanceof Error) throw edge;

    return edge;
  };
