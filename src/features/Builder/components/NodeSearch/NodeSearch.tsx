import { useSelector } from "@xstate/react";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { Form, Combobox, Input } from "@open-legal-tech/design-system";
import { useEditor } from "features/Builder/state/useEditor";

export function NodeSearch() {
  const service = useTree();
  const nodes = useSelector(service, (state) => state.context.nodes);
  const { selectedNodeId, setSelectedNodeId } = useEditor();
  const items = Object.values(nodes).map((node) => ({
    id: node.id,
    label: node.data.label,
  }));

  return (
    <Form
      onSubmit={() => {
        return;
      }}
      initialValues={{ search: "" }}
    >
      <Combobox
        Input={<Input name="search" />}
        css={{ backgroundColor: "$gray1", zIndex: "1" }}
        items={items}
        selectedItemId={selectedNodeId}
        onSelectedItemChange={({ selectedItem }) =>
          selectedItem && setSelectedNodeId(selectedItem.id)
        }
      />
    </Form>
  );
}
