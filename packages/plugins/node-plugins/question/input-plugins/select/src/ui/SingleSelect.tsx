import {
  Box,
  Button,
  Icon,
  styled,
  Form,
  focusSelectorWithin,
  TargetSelector,
} from "@open-decision/design-system";
import * as React from "react";
import { DragHandle } from "./DragHandle";
import { Reorder, useDragControls } from "framer-motion";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  InputComponentProps,
  InputPrimaryActionSlotProps,
} from "@open-decision/input-plugins-helpers";
import { SelectInputPlugin, TAnswer, TSelectInput } from "../selectPlugin";
import { CompareConditionPlugin } from "@open-decision/condition-plugins-compare";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { Edge, getNode, getNodeOptions } from "@open-decision/tree-type";
import { createTargetNode } from "@open-decision/node-plugins-helpers";

export const AddOptionButton = ({
  input,
}: InputPrimaryActionSlotProps<TSelectInput>) => {
  const treeClient = useTreeClient();
  const Select = new SelectInputPlugin(treeClient);

  return (
    <Button
      size="small"
      variant="secondary"
      onClick={() => {
        const newAnswer = Select.createAnswer({ text: "" });
        Select.addAnswer(input.id, newAnswer);
      }}
    >
      <Icon label="Neue Antwortmöglichkeit hinzufügen">
        <PlusIcon />
      </Icon>
      Hinzufügen
    </Button>
  );
};

const StyledReorderGroup = styled(Reorder.Group, {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gap: "$4",
});

export const SingleSelect = ({
  nodeId,
  input,
  onClick,
}: InputComponentProps<TSelectInput>) => {
  const treeClient = useTreeClient();
  const ref = React.useRef<HTMLDivElement | null>(null);

  const Select = new SelectInputPlugin(treeClient);
  const Compare = new CompareConditionPlugin(treeClient);

  return (
    <StyledReorderGroup
      ref={ref}
      axis="y"
      values={input.data.answers ?? []}
      onReorder={(newOrder) => {
        return Select.reorderAnswers(input)?.(newOrder);
      }}
    >
      {input.data.answers?.map((answer) => {
        const edge = Compare.getConditionByValueId(answer.id);

        return (
          <OptionTargetInput
            onClick={onClick}
            nodeId={nodeId}
            answer={answer}
            edge={edge}
            inputId={input.id}
            key={answer.id}
            groupRef={ref}
            input={input}
          />
        );
      })}
    </StyledReorderGroup>
  );
};

type SingleSelectInputProps = {
  answer: TAnswer;
  edge?: Edge.TEdge;
  nodeId: string;
  inputId: string;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
} & InputComponentProps<TSelectInput>;

export const OptionTargetInput = ({
  answer,
  edge,
  inputId,
  nodeId,
  groupRef,
  onClick,
}: SingleSelectInputProps) => {
  const treeClient = useTreeClient();
  const Select = new SelectInputPlugin(treeClient);
  const Compare = new CompareConditionPlugin(treeClient);

  const controls = useDragControls();
  const node = useTree((tree) => getNode(tree)(nodeId));
  const nodeOptions = useTree((tree) =>
    Object.values(getNodeOptions(tree)(nodeId, "Ohne Name"))
  );

  const ref = React.useRef<HTMLDivElement | null>(null);

  const formState = Form.useFormState({
    defaultValues: {
      answer: answer.text ?? "",
      target:
        nodeOptions.find((nodeOption) => nodeOption.id === edge?.target)
          ?.name ?? "",
    },
  });

  return (
    <Reorder.Item
      value={answer}
      dragListener={false}
      dragControls={controls}
      dragConstraints={groupRef}
    >
      <Form.Root
        state={formState}
        css={{
          flexDirection: "row",
          position: "relative",
          gap: "$1",
          groupColor: "$colorScheme-text",
        }}
      >
        <Box
          ref={ref}
          css={{
            flex: 1,
            borderRadius: "$md",
            layer: "2",
          }}
        >
          <Form.Input
            name={formState.names.answer}
            onChange={(event) =>
              Select.updateAnswer(inputId, answer.id, event.target.value)
            }
            placeholder="Antwort"
            css={{
              borderRadius: "0",
              borderTopLeftRadius: "inherit",
              borderTopRightRadius: "inherit",
              gridColumn: "1 / -1",
              marginBottom: "-1px",

              [`${focusSelectorWithin}`]: {
                zIndex: "$10",
              },
            }}
          />
          <TargetSelector
            nodeName={node.name}
            onClick={onClick}
            edge={edge}
            name={formState.names.target}
            value={formState.values.target}
            setValue={(newValue) =>
              formState.setValue(formState.names.target, newValue)
            }
            onCreate={(value) => {
              const input = Select.getInput(inputId);
              const variable = Select.getVariable(input);
              const condition = Compare.create({
                variableId: variable.id,
                valueId: answer.id,
              });

              treeClient.conditions.add(condition);
              return createTargetNode(treeClient)(
                nodeId,
                condition.id,
                treeClient.nodes.create.node({ name: value })
              );
            }}
            onSelect={(newItem) =>
              Select.updateTarget({
                edgeId: edge?.id,
                nodeId,
                newItem,
              })
            }
            nodeLinkCss={{ borderTopLeftRadius: 0 }}
            selectOptions={nodeOptions}
          />
        </Box>
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Button
            variant="neutral"
            type="button"
            square
            onPointerDown={(event) => controls.start(event)}
          >
            <Icon label="Verschiebe den Input">
              <DragHandle />
            </Icon>
          </Button>
          <Button
            variant="neutral"
            type="button"
            square
            onClick={() => Select.deleteAnswer(inputId, answer.id)}
          >
            <Icon label="Entferne den Input">
              <TrashIcon />
            </Icon>
          </Button>
        </Box>
      </Form.Root>
    </Reorder.Item>
  );
};
