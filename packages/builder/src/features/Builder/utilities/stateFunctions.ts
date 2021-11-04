import { Elements, Node, Connection, Edge } from "react-flow-renderer";
import { NodeData } from "../types/react-flow";

export const getElement =
  (elementId: string) =>
  (
    elements: Elements<NodeData>
  ): Node<NodeData> | Connection | Edge<NodeData> | undefined => {
    return elements.find((element) => element.id === elementId);
  };

export const updateNode =
  (nodeId: string, newNode: Partial<Node<NodeData>>) =>
  (elements: Elements<NodeData>): Elements<NodeData> => {
    return elements.map((element) => {
      if (element.id !== nodeId) return element;

      return { ...element, ...newNode };
    });
  };
