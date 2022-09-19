import { Node } from "../type-classes";
import { v4 as uuid } from "uuid";

export type NewNodeData = {
  position?: Node.TNode["position"];
  data?: {
    inputs?: Node.TNodeData["inputs"];
    name?: string;
    content?: any;
    conditions?: Node.TNodeData["conditions"];
  };
  type: string;
};

/**
 * You almost certainly do not want to use this directly, but use a plugin instead.
 * This is a low-level function that is used by plugins to create a new node.
 * @param data must include the base properties of a node
 * @returns the data merged with a unique id
 */
export const createNode = ({
  position = { x: 0, y: 0 },
  data: { name, inputs = [], conditions = [], ...data } = {},
  // FIXME remove when node plugins are implemented
  type = "customNode",
}: NewNodeData): Node.TNode => {
  // create the node object
  return {
    id: uuid(),
    // the data needs to include a name and the relational properties for inputs and conditions
    data: {
      name,
      inputs,
      conditions,
      ...data,
    },
    // the position is used to place the node on the canvas
    position,
    type,
  };
};
