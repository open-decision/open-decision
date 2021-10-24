import React from "react";
import {
  Combobox,
  Form,
  IconButton,
  StyleObject,
  Input,
} from "@open-legal-tech/design-system";
import * as Node from "../types/Node";
import { Plus } from "react-feather";
import { useCenter } from "../utilities/useCenter";
import { nodeHeight, nodeWidth } from "../utilities/constants";
import { usePartOfTree } from "../state/useTree";

type Props = { css?: StyleObject };

export const NodeCreator = ({ css }: Props) => {
  const [nodes, send] = usePartOfTree((state) => state.context.nodes);
  const [selectedNodeId] = usePartOfTree(
    (state) => state.context.selectedNodeId
  );

  const [inputValue, setInputValue] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const items = React.useMemo(
    () =>
      Object.values(nodes).map((node) => ({
        id: node.id,
        label: node.data.label,
      })),
    [nodes]
  );
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("nodeLabel", inputValue);
    event.dataTransfer.effectAllowed = "move";
  };

  const center = useCenter({ x: nodeWidth / 2, y: nodeHeight / 2 });

  return (
    <Form
      css={{ display: "flex", alignItems: "center", gap: "$2", ...css }}
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
        inputValue={inputValue}
        onInputValueChange={(inputValue) => setInputValue(inputValue)}
        isCreating={isCreating}
        onIsCreatingChange={(isCreating) => setIsCreating(isCreating)}
      />
      <IconButton
        size="large"
        css={{ boxShadow: "$1" }}
        label="Füge einen neuen Knoten hinzu"
        onDragStart={(event) => onDragStart(event)}
        disabled={!isCreating}
        onClick={() =>
          send({
            type: "addNode",
            value: Node.create({
              position: center,
              data: {
                label: inputValue,
              },
            }),
          })
        }
        draggable
        Icon={<Plus style={{ width: "30px", height: "30px" }} />}
      />
    </Form>
  );
};
