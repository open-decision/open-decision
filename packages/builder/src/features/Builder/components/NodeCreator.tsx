import React from "react";
import {
  Combobox,
  StyleObject,
  Input,
  Box,
  Icon,
  useForm,
} from "@open-decision/design-system";
import { Search } from "react-feather";
import { useEditor } from "../state/useEditor";
import { nodeNameMaxLength } from "../utilities/constants";
import { useNodes } from "../state/treeStore/hooks";
import { useTreeContext } from "../state/treeStore/TreeContext";

type Props = { css?: StyleObject };

export const NodeSearch = ({ css }: Props) => {
  const nodes = useNodes();
  const { addNode, addSelectedNodes, removeSelectedNodes } = useTreeContext();

  const { getCenter, zoomToNode } = useEditor();
  const [Form] = useForm({
    defaultValues: {
      selectedNodeId: "",
      search: "",
    },
    mode: "onChange",
  });

  const items = React.useMemo(
    () =>
      Object.values(nodes).map((node) => ({
        id: node.id,
        label: node.data.name,
      })),
    [nodes]
  );

  function createHandler(label: string) {
    const newNode = addNode({
      position: getCenter(),
      data: { name: label },
      selected: true,
    });

    zoomToNode(newNode);

    return { id: newNode.id, label: newNode.data.name };
  }

  function changeHandler(newSelectedItemId: string) {
    removeSelectedNodes();
    addSelectedNodes([newSelectedItemId]);
    const node = nodes.find((node) => node.id === newSelectedItemId);

    if (!node) return;
    zoomToNode(node);
  }

  return (
    <Form
      css={css}
      onSubmit={(data) => changeHandler(data.selectedNodeId ?? "")}
    >
      <Combobox.Root
        css={{ display: "flex", alignItems: "center", gap: "$2" }}
        name="selectedNodeId"
        items={items}
        onCreate={createHandler}
        key={items.length}
        onSelectedItemChange={(newItem) => changeHandler(newItem?.id ?? "")}
      >
        <Box css={{ width: "300px" }}>
          <Combobox.Input
            css={{ zIndex: "5" }}
            name="search"
            maxLength={nodeNameMaxLength}
          >
            {(field) => (
              <Input
                {...field}
                Icon={
                  <Icon>
                    <Search />
                  </Icon>
                }
                placeholder="Knotenname"
                css={{ layer: "2" }}
              />
            )}
          </Combobox.Input>
        </Box>
      </Combobox.Root>
    </Form>
  );
};
