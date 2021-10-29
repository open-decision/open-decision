import { Elements, Node, Connection, Edge } from "react-flow-renderer";
import { TNodeData } from "../types/Node";

export const getElement =
  (elementId: string) =>
  (
    elements: Elements<TNodeData>
  ): Node<TNodeData> | Connection | Edge<TNodeData> | undefined => {
    return elements.find((element) => element.id === elementId);
  };

export const updateNode =
  (nodeId: string, newNode: Partial<Node<TNodeData>>) =>
  (elements: Elements<TNodeData>): Elements<TNodeData> => {
    return elements.map((element) => {
      if (element.id !== nodeId) return element;

      return { ...element, ...newNode };
    });
  };
