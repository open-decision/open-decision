import { Heading, Row, Button, Icon } from "@open-decision/design-system";
import {
  DragHandle,
  InputComponentProps,
} from "@open-decision/plugins-node-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { TrashIcon } from "@radix-ui/react-icons";
import { Reorder, useDragControls } from "framer-motion";
import React from "react";
import { FormNodePlugin } from "../formNodePlugin";

const FormNode = new FormNodePlugin();

type InputPluginComponentProps = {
  inputIds: string[];
  nodeId: string;
};

export function InputPlugin({ inputIds, nodeId }: InputPluginComponentProps) {
  const treeClient = useTreeClient();
  const ref = React.useRef<HTMLDivElement | null>(null);

  return (
    <Reorder.Group
      as="section"
      className="gap-6 list-none p-0 grid"
      ref={ref}
      axis="y"
      values={inputIds}
      onReorder={(newOrder) => {
        return FormNode.reorderInputs(nodeId, newOrder)(treeClient);
      }}
    >
      {inputIds.map((inputId) => {
        return (
          <InputItem
            inputId={inputId}
            key={inputId}
            dragGroupRef={ref}
            nodeId={nodeId}
          />
        );
      })}
    </Reorder.Group>
  );
}

type InputItemProps = {
  dragGroupRef: React.MutableRefObject<HTMLDivElement | null>;
  nodeId: string;
} & Pick<InputComponentProps, "inputId">;

const InputItem = ({ inputId, dragGroupRef, nodeId }: InputItemProps) => {
  const treeClient = useTreeClient();

  const input = useTree((treeClient) => {
    return treeClient.pluginEntity.get.single<typeof FormNode.inputType>(
      "inputs",
      inputId
    );
  });

  const InputComponents = FormNode.inputPlugins[input.type].BuilderComponent;

  const controls = useDragControls();

  const onClick = React.useCallback(() => {
    FormNode.disconnectInputAndNode(nodeId, inputId)(treeClient);
    treeClient.pluginEntity.delete("inputs", inputId);
  }, [inputId, nodeId, treeClient]);

  return (
    <Reorder.Item
      key={input.id}
      value={input.id}
      dragListener={false}
      dragControls={controls}
      dragConstraints={dragGroupRef}
    >
      <Row className="items-center justify-between mb-2">
        <Row className="items-center gap-1 -ml-2">
          <Button
            variant="neutral"
            type="button"
            square
            className="flex-shrink-0"
            onPointerDown={(event) => controls.start(event)}
          >
            <Icon>
              <DragHandle />
            </Icon>
          </Button>
          <Heading size="extra-small">
            {input.type.charAt(0).toUpperCase() + input.type.slice(1)}{" "}
          </Heading>
          <Button variant="neutral" type="button" square onClick={onClick}>
            <Icon label="Entferne den Input">
              <TrashIcon />
            </Icon>
          </Button>
        </Row>
        {InputComponents.PrimaryActionSlot ? (
          <InputComponents.PrimaryActionSlot inputId={input.id} />
        ) : null}
      </Row>
      <InputComponents.InputConfigurator inputId={input.id} />
    </Reorder.Item>
  );
};
