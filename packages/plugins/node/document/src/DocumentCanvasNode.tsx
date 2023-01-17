import { CanvasNodeContainer } from "@open-decision/node-editor";
import { TCanvasNode } from "@open-decision/plugins-node-helpers";
import { useTree } from "@open-decision/tree-sync";

export const DocumentCanvasNode: TCanvasNode = ({ id, ...props }) => {
  const name = useTree((treeClient) => treeClient.nodes.get.single(id)?.name);

  return (
    <CanvasNodeContainer id={id} {...props}>
      {name}
    </CanvasNodeContainer>
  );
};
