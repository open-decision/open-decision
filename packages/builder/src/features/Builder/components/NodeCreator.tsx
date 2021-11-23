import React from "react";
import {
  Combobox,
  Form,
  IconButton,
  StyleObject,
  Input,
  useCombobox,
  Box,
} from "@open-legal-tech/design-system";
import { Plus } from "react-feather";
import { useCenter } from "../utilities/useCenter";
import { nodeHeight, nodeWidth } from "../utilities/constants";
import { useTree } from "../state/useTree";
import { BuilderNode } from "@open-decision/type-classes";

type Props = { css?: StyleObject };

export const NodeCreator = ({ css }: Props) => {
  const [nodes, send] = useTree((state) => state.nodes);
  const [selectedNodeId] = useTree((state) => state.selectedNodeId);

  const items = React.useMemo(
    () =>
      Object.values(nodes).map((node) => ({
        id: node.id,
        label: node.name,
      })),
    [nodes]
  );

  const center = useCenter({ x: nodeWidth / 2, y: nodeHeight / 2 });

  function createHandler(label: string) {
    const newNode = BuilderNode.create({
      position: center,
      name: label,
    });
    send({ type: "addNode", value: newNode });

    return { id: newNode.id, label: newNode.name };
  }

  return (
    // @ts-expect-error - complex union type
    <Form
      css={css}
      onChange={({ values }) => {
        return send({ type: "selectNode", nodeId: values.search });
      }}
      initialValues={{ search: selectedNodeId ?? "" }}
    >
      <Combobox.Root
        css={{ display: "flex", alignItems: "center", gap: "$2" }}
        name="search"
        items={items}
        onCreate={createHandler}
        resetOnBlur
      >
        <NodeCreatorInput createHandler={createHandler} />
      </Combobox.Root>
    </Form>
  );
};
const NodeCreatorInput = ({ createHandler }) => {
  const [, send] = useTree((state) => state.nodes);

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("nodeLabel", inputValue);
    event.dataTransfer.effectAllowed = "move";
  };

  const { isCreating, inputValue, setInputValue } = useCombobox();

  return (
    <Box css={{ display: "flex", gap: "$2" }}>
      <Combobox.Input css={{ backgroundColor: "$gray1", zIndex: "5" }}>
        <Input name="search" />
      </Combobox.Input>

      <IconButton
        css={{ boxShadow: "$1" }}
        label="Füge einen neuen Knoten hinzu"
        onDragStart={(event) => onDragStart(event)}
        disabled={!isCreating}
        onClick={() => {
          const newNode = createHandler(inputValue);
          send({ type: "selectNode", nodeId: newNode.id });
          setInputValue("");
        }}
        draggable
        Icon={<Plus style={{ width: "30px", height: "30px" }} />}
      />
    </Box>
  );
};
