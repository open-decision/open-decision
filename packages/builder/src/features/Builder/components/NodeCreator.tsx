import React from "react";
import {
  Combobox,
  Button,
  StyleObject,
  Input,
  useCombobox,
  Box,
  InputWithButton,
  Icon,
  useForm,
} from "@open-decision/design-system";
import { Plus } from "react-feather";
import { useEditor } from "../state/useEditor";
import { nodeNameMaxLength } from "../utilities/constants";
import { addNode, selectNode } from "../state/treeStore/treeStore";
import { useNodes } from "../state/treeStore/hooks";

type Props = { css?: StyleObject };

export const NodeCreator = ({ css }: Props) => {
  const nodes = useNodes();

  const { getCenter } = useEditor();
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
        label: node.name,
      })),
    [nodes]
  );

  function createHandler(label: string) {
    const newNode = addNode({ position: getCenter(), name: label });

    return { id: newNode.id, label: newNode.name };
  }

  function changeHandler(newSelectedItemId: string) {
    selectNode(newSelectedItemId);
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
        <NodeCreatorInput
          autoFocus={Object.keys(nodes).length === 0}
          createHandler={createHandler}
        />
      </Combobox.Root>
    </Form>
  );
};

const NodeCreatorInput = ({ createHandler, autoFocus }) => {
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("nodeLabel", inputValue);
    event.dataTransfer.effectAllowed = "move";
  };

  const { isCreating, inputValue, setInputValue } = useCombobox();

  return (
    <Box css={{ width: "300px" }}>
      <Combobox.Input
        css={{ zIndex: "5" }}
        name="search"
        maxLength={nodeNameMaxLength}
      >
        {(field) => (
          <InputWithButton
            css={{ layer: "2" }}
            Input={
              <Input
                {...field}
                autoFocus={autoFocus}
                placeholder="Knotenname"
              />
            }
            Button={
              <Button
                css={{ boxShadow: "$1" }}
                onDragStart={(event) => onDragStart(event)}
                disabled={!isCreating}
                onClick={() => {
                  const newNode = createHandler(inputValue);
                  selectNode(newNode.id);
                  setInputValue("");
                }}
                square
                draggable
              >
                <Icon label="Füge einen neuen Knoten hinzu">
                  <Plus />
                </Icon>
              </Button>
            }
          />
        )}
      </Combobox.Input>
    </Box>
  );
};
