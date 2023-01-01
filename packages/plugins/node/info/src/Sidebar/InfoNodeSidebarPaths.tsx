import { Form, Tabs, TargetSelector } from "@open-decision/design-system";
import { useTree } from "@open-decision/tree-sync";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { InfoNodePlugin } from "../infoNodePlugin";

const InfoNode = new InfoNodePlugin();
const DirectEdge = new DirectEdgePlugin();

type Props = {
  nodeId: string;
};

export function InfoNodeSidebarPaths({ nodeId }: Props) {
  const edge = useTree(
    (treeClient) =>
      Object.values(
        DirectEdge.get.byNode(nodeId)(treeClient)?.source ?? {}
      )?.[0]
  );

  const nodeNames = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name"))
  );

  const targetNodeName = useTree((treeClient) => {
    return edge?.target
      ? treeClient.nodes.get.single(edge.target)?.name ?? "Zielknoten ohne Name"
      : undefined;
  });

  const methods = Form.useForm({
    defaultValues: {
      target: targetNodeName,
    },
  });

  return (
    <Tabs.Content value="Ziel">
      <Form.Root methods={methods}>
        <TargetSelector
          name="target"
          onNodeCreate={InfoNode.create}
          onEdgeCreate={DirectEdge.create}
          nodeId={nodeId}
          edge={edge}
          selectOptions={nodeNames}
        />
      </Form.Root>
    </Tabs.Content>
  );
}
