import {
  Heading,
  Row,
  Button,
  Icon,
  stackClasses,
} from "@open-decision/design-system";
import { SidebarButton, sidebarCardClasses } from "@open-decision/node-editor";
import {
  DragHandle,
  InputDropdown,
  TInputId,
} from "@open-decision/plugins-node-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Reorder, useDragControls } from "framer-motion";
import React from "react";
import { FormNodePlugin } from "../FormNodePlugin";
import { PlaceholderInputPlugin } from "@open-decision/plugins-node-helpers";
import { TFormNodeInput } from "../FormNodeInputs";
import { TNodeId } from "@open-decision/tree-type";

const FormNode = new FormNodePlugin();
const PlaceholderInput = new PlaceholderInputPlugin();

type InputPluginComponentProps = {
  inputIds: TInputId[];
  nodeId: TNodeId;
};

export function InputPlugin({ inputIds, nodeId }: InputPluginComponentProps) {
  const treeClient = useTreeClient();
  const ref = React.useRef<HTMLDivElement | null>(null);

  return (
    <Reorder.Group
      as="section"
      className="gap-2 list-none p-0 grid"
      ref={ref}
      axis="y"
      values={inputIds}
      onReorder={(newOrder) => {
        return FormNode.reorderInputs(nodeId, newOrder)(treeClient);
      }}
    >
      <Heading size="extra-small">Inputs</Heading>
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
      <SidebarButton
        onClick={() => {
          const input = PlaceholderInput.create({});
          FormNode.inputs.add(input)(treeClient);
          FormNode.connectInputAndNode(nodeId, input.id)(treeClient);
        }}
      >
        Input hinzufügen
      </SidebarButton>
    </Reorder.Group>
  );
}

type InputItemProps = {
  dragGroupRef: React.MutableRefObject<HTMLDivElement | null>;
  nodeId: TNodeId;
  inputId: TInputId;
};

const InputItem = ({ inputId, dragGroupRef, nodeId }: InputItemProps) => {
  const treeClient = useTreeClient();

  const input = useTree((treeClient) => {
    return treeClient.pluginEntity.get.single<TFormNodeInput>(
      "inputs",
      inputId
    );
  });

  const controls = useDragControls();

  const onClick = React.useCallback(() => {
    FormNode.disconnectInputAndNode(nodeId, inputId)(treeClient);
    treeClient.pluginEntity.delete("inputs", inputId);
  }, [inputId, nodeId, treeClient]);

  if (!input) return null;

  const InputComponents = FormNode.inputPlugins.Builder[input.type];

  return (
    <Reorder.Item
      key={input.id}
      value={input.id}
      dragListener={false}
      dragControls={controls}
      dragConstraints={dragGroupRef}
      className={stackClasses({}, sidebarCardClasses)}
    >
      <Row className="items-center justify-between">
        <Row className="items-center">
          <Button
            variant="neutral"
            type="button"
            square
            className="flex-shrink-0"
            size="small"
            onPointerDown={(event) => controls.start(event)}
            alignByContent="left"
          >
            <Icon>
              <DragHandle />
            </Icon>
          </Button>
          <InputDropdown
            currentType={input.type}
            inputPlugins={FormNode.inputPlugins.types}
            onSelect={(newType) => {
              const newInput = FormNode.inputPlugins.plugins[newType].create(
                {}
              );

              FormNode.inputPlugins.plugins[input.type].update(
                inputId,
                newInput
              )(treeClient);
            }}
            alignByContent="left"
          />
        </Row>
        <Row className="items-center">
          {InputComponents.PrimaryActionSlot ? (
            <InputComponents.PrimaryActionSlot inputId={input.id} />
          ) : null}
          <Button
            variant="neutral"
            type="button"
            square
            onClick={onClick}
            size="small"
          >
            <Icon label="Entferne den Input">
              <CrossCircledIcon />
            </Icon>
          </Button>
        </Row>
      </Row>
      {InputComponents.InputConfigurator ? (
        <InputComponents.InputConfigurator inputId={input.id} />
      ) : null}
    </Reorder.Item>
  );
};
