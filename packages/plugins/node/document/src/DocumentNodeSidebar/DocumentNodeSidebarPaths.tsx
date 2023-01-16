import {
  stackClasses,
  Tabs,
  Form,
  TargetSelector,
} from "@open-decision/design-system";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { TNodeSidebarProps } from "@open-decision/plugins-node-helpers";
import { useTree } from "@open-decision/tree-sync";
import { TNodeId } from "@open-decision/tree-type";
import { DocumentNodePlugin } from "../DocumentNodePlugin";

const DocumentNode = new DocumentNodePlugin();
const DirectEdge = new DirectEdgePlugin();

type Props = { nodeId: TNodeId } & Pick<TNodeSidebarProps, "onNodeCreate">;

export function DocumentNodeSidebarPaths({ nodeId, onNodeCreate }: Props) {
  const node = useTree(DocumentNode.getSingle(nodeId));

  const edge = useTree((treeClient) => {
    return Object.values(
      treeClient.edges.get.byNode(nodeId)?.source ?? {}
    )?.[0];
  });

  const nodeNames = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name"))
  );

  const targetNodeName = useTree((treeClient) => {
    return edge?.target
      ? treeClient.nodes.get.single(edge.target)?.name ?? "Zielknoten ohne Name"
      : undefined;
  });

  const methods = Form.useForm({
    defaultValues:
      node instanceof Error
        ? {}
        : {
            target: targetNodeName,
          },
  });

  return (
    <Tabs.Content value="Ziel" className={stackClasses({}, "gap-2")}>
      <Form.Root methods={methods}>
        <TargetSelector
          name="target"
          nodeId={nodeId}
          edge={edge}
          onNodeCreate={onNodeCreate}
          onEdgeCreate={({ source, target }) =>
            DirectEdge.create({ source, target })
          }
          selectOptions={nodeNames}
        />
      </Form.Root>
    </Tabs.Content>
  );
}
