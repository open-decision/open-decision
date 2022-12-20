import { CanvasNodeContainer, CanvasNode } from "@open-decision/node-editor";
import { useTree } from "@open-decision/tree-sync";

export const InfoCanvasNode: CanvasNode = ({ id, ...props }) => {
  const name = useTree((treeClient) => treeClient.nodes.get.single(id).name);

  return (
    <CanvasNodeContainer id={id} {...props}>
      {name}
    </CanvasNodeContainer>
  );
};
