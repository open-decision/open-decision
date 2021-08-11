import { Elements, Node, Connection, Edge } from "react-flow-renderer";
import { TElementData } from "../types";

export const getElement =
  (elementId: string) =>
  (
    elements: Elements<TElementData>
  ): Node<TElementData> | Connection | Edge<TElementData> | undefined => {
    return elements.find((element) => element.id === elementId);
  };

export const updateNode =
  (nodeId: string, newNode: Partial<Node<TElementData>>) =>
  (elements: Elements<TElementData>): Elements<TElementData> => {
    return elements.map((element) => {
      if (element.id !== nodeId) return element;

      return { ...element, ...newNode };
    });
  };
