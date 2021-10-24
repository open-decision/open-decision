import * as React from "react";
import { Form, Combobox, Input } from "@open-legal-tech/design-system";
import * as Node from "features/Builder/types/Node";
import { useCenter } from "features/Builder/utilities/useCenter";
import { nodeHeight, nodeWidth } from "features/Builder/utilities/constants";
import { usePartOfTree } from "features/Builder/state/useTree";

export function NodeSearch() {
  const [nodes, send] = usePartOfTree((state) => state.context.nodes);
  const [selectedNodeId] = usePartOfTree(
    (state) => state.context.selectedNodeId
  );
  const items = React.useMemo(
    () =>
      Object.values(nodes).map((node) => ({
        id: node.id,
        label: node.data.label,
      })),
    [nodes]
  );

  const center = useCenter({ x: nodeWidth / 2, y: nodeHeight / 2 });

  return (
    <Form
      onChange={({ values }) =>
        send({ type: "selectNode", nodeId: values.search })
      }
      initialValues={{ search: selectedNodeId }}
    >
      <Combobox
        Input={<Input name="search" size="large" />}
        css={{ backgroundColor: "$gray1", zIndex: "5" }}
        items={items}
        onCreate={(label) => {
          const newNode = Node.create({
            position: center,
            data: { label },
          });
          send({ type: "addNode", value: newNode });

          return { id: newNode.id, label: newNode.data.label };
        }}
      />
    </Form>
  );
}
