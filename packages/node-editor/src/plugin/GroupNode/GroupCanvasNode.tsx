import { CanvasNodeContainer, CanvasNode } from "../components";
import { useTree } from "@open-decision/tree-sync";

export const GroupCanvasNode: CanvasNode = ({ id, ...props }) => {
  const node = useTree((treeClient) => treeClient.nodes.get.single(id));

  return node ? (
    <CanvasNodeContainer id={id} {...props}>
      {node.name}
    </CanvasNodeContainer>
  ) : null;
};
