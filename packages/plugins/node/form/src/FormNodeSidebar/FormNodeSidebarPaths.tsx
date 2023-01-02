import { Form, Tabs, TargetSelector } from "@open-decision/design-system";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { TNodeSidebarProps } from "@open-decision/plugins-node-helpers";
import { useTree } from "@open-decision/tree-sync";

const DirectEdge = new DirectEdgePlugin();

type Props = Pick<TNodeSidebarProps, "onNodeCreate" | "nodeId">;

export function FormNodeSidebarPaths({ nodeId, onNodeCreate }: Props) {
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
          onNodeCreate={onNodeCreate}
          onEdgeCreate={DirectEdge.create}
          nodeId={nodeId}
          edge={edge}
          selectOptions={nodeNames}
        />
      </Form.Root>
    </Tabs.Content>
  );
}
