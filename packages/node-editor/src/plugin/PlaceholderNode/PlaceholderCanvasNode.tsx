import { TCanvasNode } from "@open-decision/plugins-node-helpers";
import { useTree } from "@open-decision/tree-sync";
import { CanvasNodeContainer } from "../components/CanvasNode";
import { PlaceholderNodePlugin } from "./PlaceholderNodePlugin";

const PlaceholderNode = new PlaceholderNodePlugin();

export const PlaceholderCanvasNode: TCanvasNode = (props) => {
  const node = useTree(PlaceholderNode.getSingle(props.id));

  if (!node) return null;

  return <CanvasNodeContainer {...props}>{node.name}</CanvasNodeContainer>;
};
