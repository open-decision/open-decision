import * as BuilderNode from "../Node/BuilderNode";
import * as PublicNode from "../Node/PublicNode";
import * as BuilderTree from "../Tree/BuilderTree";
import * as PublicTree from "../Tree/PublicTree";
import { pipe, flatMap, filter, map } from "remeda";
import { values } from "ramda";
import { createAdjacencyList, depthFirstSearch } from "./utils";

export const getParents =
  (id: string) => (tree: PublicTree.TTree | BuilderTree.TTree) =>
    pipe(
      tree.nodes,
      values,
      flatMap((node) =>
        pipe(
          node.relations,
          values,
          filter((relation) => relation.id === id),
          map((relation) => relation.id)
        )
      )
    );

export const getChildren =
  (node: BuilderNode.TNode | PublicNode.TNode) =>
  (tree: BuilderTree.TTree | PublicTree.TTree) =>
    pipe(tree.nodes[node.id], (node) =>
      pipe(
        node.relations,
        values,
        filter((relation) => !!relation.target),
        map((relation) => relation.target)
      )
    );

export const circularConnection =
  (tree: PublicTree.TTree | BuilderTree.TTree) =>
  ({ source, target }: { source: string; target: string }): boolean => {
    const nodesOnPaths = getPaths(tree.nodes[source])(tree).flatMap(
      (path) => path
    );

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };

export const getPaths =
  ({ id }: PublicNode.TNode | BuilderNode.TNode) =>
  (tree: PublicTree.TTree | BuilderTree.TTree) => {
    const adjacencyList = createAdjacencyList(tree.nodes);

    return depthFirstSearch(id, adjacencyList);
  };

export const getConnectableNodes =
  (node: PublicNode.TNode | BuilderNode.TNode) =>
  (tree: PublicTree.TTree | BuilderTree.TTree) => {
    const nodesOnPath = getPaths(node)(tree).flatMap((path) => path);

    return pipe(
      tree.nodes,
      values,
      filter(
        (iteratedNode) =>
          iteratedNode.id !== node.id && !nodesOnPath.includes(iteratedNode.id)
      )
    );
  };
