import { CanvasNodeContainer, CanvasNode } from "../components";
import { useTree } from "@open-decision/tree-sync";

export const GroupCanvasNode: CanvasNode = ({ id, ...props }) => {
  const name = useTree((treeClient) => treeClient.nodes.get.single(id).name);

  return (
    <CanvasNodeContainer id={id} {...props}>
      {name}
    </CanvasNodeContainer>
  );
};
