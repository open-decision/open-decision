import { assign as immerAssign } from "@xstate/immer";
import { equals, merge, pipe } from "remeda";
import * as Option from "fp-ts/Option";
import { nanoid } from "nanoid/non-secure";
import { Context, sendToTreePayload } from "./treeMachine";
import { Node, TNode, TNodeData, TPath } from "../types/Node";
import { Edge, TEdge } from "../types/Edge";

export type CreateTreeEvent = { type: "createTree" };
export type NoTreeEvent = { type: "noTree" };

export type Events =
  | CreateTreeEvent
  | AddNodeEvent
  | UpdateNodeEvent
  | UpdateNodeDataEvent
  | DeleteNodeEvent
  | AddEdgeEvent
  | UpdateEdgeEvent
  | DeleteEdgeEvent
  | AddInputEvent
  | UpdateInputEvent
  | DeleteInputEvent
  | AddPathEvent
  | UpdatePathEvent
  | DeletePathEvent;

export type AddNodeEvent = { type: "addNode"; value: TNode };
export const addNode = immerAssign(
  (context: Context, { value }: AddNodeEvent) => {
    context.nodes[value.id] = value;
  }
);

export type UpdateNodeEvent = {
  type: "updateNode";
  id: string;
  node: Omit<Partial<TNode>, "data">;
};
export const updateNode = immerAssign(
  (context: Context, { id, node }: UpdateNodeEvent) => {
    const oldElement = context.nodes[id];

    context.nodes[id] = {
      ...oldElement,
      ...node,
    };
  }
);

export type UpdateNodeDataEvent = {
  type: "updateNodeData";
  id: string;
  data: Partial<TNodeData>;
};
export const updateNodeData = immerAssign(
  (context: Context, { id, data }: UpdateNodeDataEvent) => {
    const oldElement = context.nodes[id];

    context.nodes[id] = {
      ...oldElement,
      data: {
        ...oldElement.data,
        ...data,
      },
    };
  }
);

export type DeleteNodeEvent = { type: "deleteNode"; ids: string[] };
export const deleteNode = immerAssign(
  (context: Context, { ids }: DeleteNodeEvent) => {
    ids.forEach((id) => {
      delete context.nodes[id];
    });
  }
);

const addEdge = (context: Context, { connection }: AddEdgeEvent) => {
  pipe(
    connection,
    Edge.createEdge,
    Edge.validEdge(context.edges),
    Option.fold(
      () => null,
      (newEdge) => {
        // When a user creates an Edge between two nodes the intent is two have an input from the source node
        // lead to the target node. Since there cannot already be an input when an edge can be created between
        // two nodes we create an empty input on the source node with the an established relationship between the input
        // and the edge.
        const newInput = Node.createPath({
          target: newEdge.target,
        });

        // We keep the ids for the newly created input on the edge to allow removing the relationship when the
        // edge is removed.
        newEdge.inputs.push({ nodeId: newEdge.source, inputId: newInput.id });

        // Now we can add the new Edge to the state.
        context.edges[newEdge.id] = newEdge;
        // And add the new input to the source node.
        context.nodes[newEdge.source].data.inputs[newInput.id] = newInput;
      }
    )
  );
};

export type AddEdgeEvent = {
  type: "addEdge";
  connection: Omit<TEdge, "id">;
};
export const assignAddEdge = immerAssign(addEdge);

export type UpdateEdgeEvent = {
  type: "updateEdge";
  id: string;
  data: Partial<TEdge>;
};
export const updateEdge = immerAssign(
  (context: Context, { id, data }: UpdateEdgeEvent) => {
    const oldEdgeData = context.edges[id];
    context.edges[id] = merge(oldEdgeData, data);

    if (data.target) {
      oldEdgeData.inputs.forEach(({ inputId }) => {
        context.nodes[oldEdgeData.source].data.inputs[inputId].target =
          data.target;
      });
    }
  }
);

export type DeleteEdgeEvent = {
  type: "deleteEdge";
  ids: string[];
};
export const deleteEdge = immerAssign(
  (context: Context, { ids }: DeleteEdgeEvent) => {
    ids.forEach((id) => {
      // Because of the relationship between Edges and Inputs we remove the Edge from
      // all the Inputs it is associated with.
      const inputs = context.edges[id].inputs;

      inputs.forEach(({ nodeId, inputId }) => {
        delete context.nodes[nodeId].data.inputs[inputId].target;
      });

      delete context.edges[id];
    });
  }
);

export type AddInputEvent = {
  type: "addInput";
  nodeId: string;
  value?: string;
};

export const addInput = immerAssign(
  (context: Context, { nodeId, value }: AddInputEvent) => {
    const id = nanoid(5);

    context.nodes[nodeId].data.inputs[id] = { id, value: value ?? "" };
  }
);

export type UpdateInputEvent = {
  type: "updateInput";
  nodeId: string;
  inputId: string;
  value: string;
};

export const updateInput = immerAssign(
  (context: Context, { nodeId, inputId, value }: UpdateInputEvent) => {
    context.nodes[nodeId].data.inputs[inputId].value = value;
  }
);

export type DeleteInputEvent = {
  type: "deleteInput";
  nodeId: string;
  inputId: string;
};

export const deleteInput = immerAssign(
  (context: Context, { nodeId, inputId }: DeleteInputEvent) => {
    delete context.nodes[nodeId].data.inputs[inputId];
  }
);

type AddPathEvent = {
  type: "addPath";
  nodeId: string;
  inputId: string;
  targetId: string;
};
export const addPath = immerAssign<Context, AddPathEvent>(
  (context, { nodeId, inputId, targetId }) => {
    const edge = pipe(
      Edge.getEdgeByPartialEdge({ source: nodeId, target: targetId })(context),
      Option.fold(
        () =>
          Edge.createEdge({
            source: nodeId,
            target: targetId,
            inputs: [{ nodeId, inputId }],
          }),
        (edge) => ({ ...edge, inputs: [...edge.inputs, { nodeId, inputId }] })
      )
    );

    context.edges[edge.id] = edge;

    const newInput: TPath = pipe(
      context,
      Node.getPath(nodeId, inputId),
      Option.fold(
        () => Node.createPath({ target: targetId }),
        (value) => ({ ...value, target: targetId })
      )
    );

    context.nodes[nodeId].data.inputs[inputId] = newInput;
  }
);

type UpdatePathEvent = {
  type: "updatePath";
  nodeId: string;
  inputId: string;
  targetId: string;
};
export const updatePath = immerAssign<Context, UpdatePathEvent>(
  (context, { nodeId, inputId, targetId }) => {
    const oldTargetId = context.nodes[nodeId].data.inputs[inputId].target;

    if (oldTargetId) {
      const oldEdgeId = Edge.createEdgeId({
        source: nodeId,
        target: oldTargetId,
      });
      // Remove the input from the currently associated edge
      pipe(
        context,
        Edge.getEdgeByPartialEdge({ source: nodeId, target: oldTargetId }),
        Option.map((edge) => ({
          ...edge,
          inputs: edge.inputs.filter(
            (input) => !equals(input, { nodeId, inputId })
          ),
        })),
        Option.chainNullableK((edge) =>
          edge.inputs.length !== 0 ? edge : null
        ),
        Option.fold(
          () => {
            delete context.edges[oldEdgeId];
          },
          (updatedEdge) => {
            context.edges[oldEdgeId] = updatedEdge;
          }
        )
      );
    }

    const newEdge = pipe(
      Edge.getEdgeByPartialEdge({ source: nodeId, target: targetId })(context),
      Option.fold(
        () =>
          Edge.createEdge({
            source: nodeId,
            target: targetId,
            inputs: [{ nodeId, inputId }],
          }),
        (edge) => ({
          ...edge,
          inputs: [...edge.inputs, { nodeId, inputId }],
        })
      )
    );

    context.edges[newEdge.id] = newEdge;
    context.nodes[nodeId].data.inputs[inputId].target = targetId;
  }
);

type DeletePathEvent = {
  type: "deletePath";
  nodeId: string;
  inputId: string;
};
export const deletePath = immerAssign<Context, DeletePathEvent>(
  (context, { nodeId, inputId }) => {
    const input = context.nodes[nodeId].data.inputs[inputId];

    if (!input?.target) return;
    const edgeId = Edge.createEdgeId({ source: nodeId, target: input.target });

    pipe(
      Edge.getEdgeByPartialEdge({ source: nodeId, target: input.target })(
        context
      ),
      Option.map((edge) => ({
        ...edge,
        inputs: edge.inputs.filter(
          (input) => !equals(input, { nodeId, inputId })
        ),
      })),
      Option.chainNullableK((edge) => (edge.inputs.length !== 0 ? edge : null)),
      Option.fold(
        () => {
          delete context.edges[edgeId];
        },
        (updatedEdge) => {
          context.edges[edgeId] = updatedEdge;
        }
      )
    );

    delete context.nodes[nodeId].data.inputs[inputId].target;
  }
);

export function createNewAssociatedNode(
  node: TNode,
  inputId: string
): sendToTreePayload {
  const id = nanoid(5);
  const position = { x: node.position.x, y: node.position.y + 80 };

  return [
    {
      type: "addNode",
      value: {
        id,
        position,
        type: "default",
        data: { inputs: {}, content: [], label: "Neuer Knoten" },
      },
    },
    {
      type: "addPath",
      inputId,
      nodeId: node.id,
      targetId: id,
    },
    {
      type: "addEdge",
      connection: {
        source: node.id,
        target: id,
        inputs: [{ nodeId: node.id, inputId }],
      },
    },
  ];
}
