import { CanvasNodeContainer } from "../components";
import { useTree } from "@open-decision/tree-sync";
import { CanvasNode } from "@open-decision/plugins-node-helpers";

export const GroupCanvasNode: CanvasNode = ({ id, ...props }) => {
  const node = useTree((treeClient) => treeClient.nodes.get.single(id));

  return node ? (
    <CanvasNodeContainer id={id} {...props}>
      {node.name}
    </CanvasNodeContainer>
  ) : null;
};
