import { CanvasNodeContainer } from "../components";
import { useTree } from "@open-decision/tree-sync";
import { TCanvasNode } from "@open-decision/plugins-node-helpers";

export const GroupCanvasNode: TCanvasNode = ({ id, ...props }) => {
  const node = useTree((treeClient) => treeClient.nodes.get.single(id));

  return node ? (
    <CanvasNodeContainer id={id} {...props}>
      {node.name}
    </CanvasNodeContainer>
  ) : null;
};
