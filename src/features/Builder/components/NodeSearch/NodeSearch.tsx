import { useSelector } from "@xstate/react";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { Form, Combobox, Input } from "@open-legal-tech/design-system";
import { useEditor } from "features/Builder/state/useEditor";
import * as Node from "features/Builder/types/Node";
import { useCenter } from "features/Builder/utilities/useCenter";
import { nodeHeight, nodeWidth } from "features/Builder/utilities/constants";

export function NodeSearch() {
  const service = useTree();
  const nodes = useSelector(service, (state) => state.context.nodes);
  const { selectedNodeId, setSelectedNodeId } = useEditor();
  const items = Object.values(nodes).map((node) => ({
    id: node.id,
    label: node.data.label,
  }));

  const center = useCenter({ x: nodeWidth / 2, y: nodeHeight / 2 });

  return (
    <Form
      onChange={({ values }) => setSelectedNodeId(values.search)}
      initialValues={{ search: selectedNodeId ?? "" }}
    >
      <Combobox
        Input={<Input name="search" />}
        css={{ backgroundColor: "$gray1", zIndex: "1" }}
        items={items}
        onCreate={(label) => {
          const newNode = Node.create({
            position: center,
            data: { label },
          });
          service.send({ type: "addNode", value: newNode });
          return { id: newNode.id, label: newNode.data.label };
        }}
      />
    </Form>
  );
}
