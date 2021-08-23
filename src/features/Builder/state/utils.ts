import { Either, left, right } from "fp-ts/lib/Either";
import { Connection, Edge, isEdge } from "react-flow-renderer";
import { exampleNodeTypes, examplePortTypes } from "../tests/nodes";
import { TEdge, TEdgesRecord, TTree } from "../types";

export function createNewTree(): TTree {
  return {
    id: "tree",
    config: {
      nodeTypes: exampleNodeTypes,
      portTypes: examplePortTypes,
    },
    nodes: {},
    edges: {},
    treeName: "Unbenannt",
  };
}

const getEdgeId = ({
  source,
  sourceHandle,
  target,
  targetHandle,
}: Connection): string =>
  `reactflow__edge-${source}${sourceHandle}-${target}${targetHandle}`;

const connectionExists = (_edge: Edge, edges: TEdge[]) => {
  return edges.some(
    (edge) =>
      isEdge(edge) && edge.source === edge.source && edge.target === edge.target
    // Currently source handles are not used by our implementation
    // &&
    // (edge.sourceHandle === edge.sourceHandle ||
    //   (!edge.sourceHandle && !edge.sourceHandle)) &&
    // (edge.targetHandle === edge.targetHandle ||
    //   (!edge.targetHandle && !edge.targetHandle))
  );
};

export const createEdge =
  (edges: TEdgesRecord) =>
  (edgeParams: Connection | Edge<any>): Either<string, TEdge> => {
    if (!edgeParams.source || !edgeParams.target) {
      return left("Can't create edge. An edge needs a source and a target.");
    }

    let edge: TEdge;
    if (isEdge(edgeParams)) {
      edge = { ...edgeParams, label: "" };
    } else {
      edge = {
        ...edgeParams,
        id: getEdgeId(edgeParams),
      } as TEdge;
    }

    if (connectionExists(edge, Object.values(edges))) {
      return left("Connection already exists");
    }

    return right(edge);
  };
