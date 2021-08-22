import { Either, left, right } from "fp-ts/lib/Either";
import { Connection, Edge, isEdge } from "react-flow-renderer";
import { exampleNodeTypes, examplePortTypes } from "../tests/nodes";
import { TEdge, TElements, TTree } from "../types";

export function createNewTree(): TTree {
  return {
    config: {
      nodeTypes: exampleNodeTypes,
      portTypes: examplePortTypes,
    },
    state: {
      elements: { nodes: {}, edges: {} },
      treeName: "Unbenannt",
    },
  };
}

const getEdgeId = ({
  source,
  sourceHandle,
  target,
  targetHandle,
}: Connection): string =>
  `reactflow__edge-${source}${sourceHandle}-${target}${targetHandle}`;

const connectionExists = (edge: Edge, edges: TEdge[]) => {
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
  (elements: TElements) =>
  (edgeParams: Connection | Edge<any>): Either<string, TEdge> => {
    if (!edgeParams.source || !edgeParams.target) {
      console.warn("Can't create edge. An edge needs a source and a target.");
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

    if (connectionExists(edge, Object.values(elements.edges))) {
      return left("Connection already exists");
    }

    return right(edge);
  };
