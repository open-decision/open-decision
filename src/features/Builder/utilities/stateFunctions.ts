import { Elements, Node, Connection, Edge } from "react-flow-renderer";
import { ElementData } from "../NodeEditor";

export const getElement = (elementId: string) => (
  elements: Elements<ElementData>
): Node<ElementData> | Connection | Edge<ElementData> | undefined => {
  return elements.find((element) => element.id === elementId);
};

export const updateNode = (
  nodeId: string,
  newNode: Partial<Node<ElementData>>
) => (elements: Elements<ElementData>): Elements<ElementData> => {
  return elements.map((element) => {
    if (element.id !== nodeId) return element;

    return { ...element, ...newNode };
  });
};
