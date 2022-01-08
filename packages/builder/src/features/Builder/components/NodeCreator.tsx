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
  useFormContext,
} from "@open-legal-tech/design-system";
import { Plus } from "react-feather";
import { useTree } from "../state/useTree";
import { useEditor } from "../state/useEditor";
import { BuilderNode } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../utilities/constants";

type Props = { css?: StyleObject };

export const NodeCreator = ({ css }: Props) => {
  const [nodes, send] = useTree((state) => state.nodes);
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
    const newNode = BuilderNode.create({
      position: getCenter(),
      name: label,
    });
    send({ type: "addNode", value: newNode });

    return { id: newNode.id, label: newNode.name };
  }

  function changeHandler(newSelectedItemId: string) {
    send({ type: "selectNode", nodeId: newSelectedItemId });
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
  const [, send] = useTree((state) => state.nodes);

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("nodeLabel", inputValue);
    event.dataTransfer.effectAllowed = "move";
  };

  const { isCreating, inputValue, setInputValue } = useCombobox();

  return (
    <Box css={{ width: "300px" }}>
      <Combobox.Input
        css={{ backgroundColor: "$gray1", zIndex: "5" }}
        name="search"
        maxLength={nodeNameMaxLength}
      >
        {(field) => (
          <InputWithButton
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
                  send({ type: "selectNode", nodeId: newNode.id });
                  setInputValue("");
                }}
                draggable
                square
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
